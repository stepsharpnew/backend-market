import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProduct.dto';
import slugify from 'slugify';
import { CategoryEntity } from 'src/entitys/category.entity';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ProductsService {
    constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository : Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository : Repository<CategoryEntity>
    ){}


    async getAllProducts(query:any):Promise<ProductEntity[]> {
        const queryBuilder = this.productRepository.createQueryBuilder('products')
        // queryBuilder.leftJoinAndSelect('products.category','category')

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
        return products
    }

    async getProductBySlug(slug : string):Promise<ProductEntity> {
        const product = await this.productRepository.findOne({
            where : {
                slug
            }
        })
        if (!product) {
            throw new HttpException('Товаров нет', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        return product
    }


    async createProduct(createProductDTO : CreateProductDTO, user_id : number):Promise<ProductEntity>{
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

}
