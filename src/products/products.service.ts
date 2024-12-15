import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProduct.dto';
import slugify from 'slugify';
import { CategoryEntity } from 'src/entitys/category.entity';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { CacheService } from 'src/config/cacheService';
import { UserEntity } from 'src/user/user.entity';
import { FavoriteEntity } from 'src/entitys/favorite.entity';


@Injectable()
export class ProductsService {
    constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository : Repository<ProductEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository : Repository<CategoryEntity>,

    @InjectRepository(FavoriteEntity)
    private readonly favoritesRepository : Repository<FavoriteEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository : Repository<UserEntity>,
    private readonly cacheService : CacheService
    ){}


    async getAllProducts(query:any):Promise<ProductEntity[]> {
        let cacheProducts = await this.cacheService.get<ProductEntity[]>('products')
        if (cacheProducts) {
            return cacheProducts 
        }

        const queryBuilder = this.productRepository.createQueryBuilder('products')
        if (query.limit) {
            queryBuilder.limit(query.limit)
            // queryBuilder.orderBy('createdAt','DESC')
        }
        if (query.offset) {
            if (query.limit) {
                queryBuilder.offset(query.offset*query.limit) 

            }else{
                queryBuilder.offset(query.offset)
            }

        }
        const products = await queryBuilder.getMany()
        await this.cacheService.set<ProductEntity[]>('products',products,50000)
        return products
    }

    async getProductBySlug(slug : string):Promise<ProductEntity> {
        const product = await this.productRepository.findOne({
            where : {
                slug
            }
        })
        if (!product) {
            throw new HttpException('Такого товара нет', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        return product
    }


    async createProduct(createProductDTO : CreateProductDTO, user_id : number):Promise<ProductEntity>{
        console.log(user_id);
        
        const productConsist = await this.productRepository.findOne({
            where : {
                name : createProductDTO.name
            }
        })
        if (productConsist) {
            throw new HttpException('Такой продукт уже есть',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const category = await this.categoryRepository.findOne({
            where : {
                category : createProductDTO.category.category
            }
        }) 
        if (!category) {
            throw new HttpException('Указанная вами категория отсутствует',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const slug = slugify(`${createProductDTO.name}-${(Math.random()*36).toString(36).substring(2)}`)
        
        // const reduced_name = slugify(createProductDTO.category.category)
        
        const product = await this.productRepository.save({...createProductDTO,slug,category})
        return product
    }
    async deleteBySlug(slug : string, id : number){
        const getProduct = await this.getProductBySlug(slug)
        const deleting = await this.productRepository.delete(getProduct.id)      
        return deleting
    }

    async getProductsByCategoty(category_short_name : string):Promise<ProductEntity[]>{
        const categories = await this.categoryRepository.findOne({
            where : {
                short_name: category_short_name,
            }
        })
        const products = await this.productRepository.find({
            where : {
                category : categories
            },
            relations : ['category']
        })
        
        return products
    }
    
    // AddProductToCategory

    async createCategory(createCategoryDTO : CreateCategoryDTO){
        const short_name = slugify(createCategoryDTO.category)
        return await this.categoryRepository.save({...createCategoryDTO, short_name})
    }


    async getuserFavorites(user:UserEntity){
        return await this.favoritesRepository.findOne({
            where : {
                user
            }
        })
    }


    async telegramSaleNotify(
        chatId : number,
    ){
        const user = await this.userRepository.findOne({
            where : {
                telegram : chatId.toString()
            }
        })
        const favorites = await this.getuserFavorites(user)
        if(!favorites){
            return []
        }
        const favoritesIds = favorites.productList
        console.log(favoritesIds);
        
        const queryBuilder = this.productRepository.createQueryBuilder('products')
        .andWhereInIds(favoritesIds)
        const products = await queryBuilder.getMany()

        let array = []
        products.forEach((product)=>{
            if (product.saleBool === true) {
                array.push(product)
            }
        })
        // console.log('Array',array);
        return array
    }


    async CreateSale(product_id : number, sale : number){
        let product = await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
        if (!product) {
            throw new HttpException('Нет такого товара', HttpStatus.BAD_REQUEST)
        }
        if (product.saleBool || product.sale) {
            throw new HttpException('Скидка уже есть', HttpStatus.BAD_REQUEST)
        }
        Object.assign(product, {...product, sale, saleBool : true})
        return await this.productRepository.save(product)
    }


    async DeleteSale(product_id : number){
        let product = await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
        if (!product) {
            throw new HttpException('Нет такого товара', HttpStatus.BAD_REQUEST)
        }
        Object.assign(product, {...product, saleBool : false, sale : 0})
        return await this.productRepository.save(product)
    }

}
