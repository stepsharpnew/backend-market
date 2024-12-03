import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/products.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { BasketProductsEntity } from 'src/entitys/basket_products.entity';

@Injectable()
export class BasketService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository : Repository<ProductEntity>,
        @InjectRepository(BasketProductsEntity)
        private readonly basketProduct_Repository : Repository<BasketProductsEntity>,
        
){}

    async getBasketUser(id : number){
        try {
            const currentUser = await this.userRepository.findOne({
                where : {
                    id
                }
            })
            if (!currentUser) {
                throw new HttpException('Нет такого пользователя',HttpStatus.UNPROCESSABLE_ENTITY)
            }
    
            const user_products = await this.basketProduct_Repository.find({
                where : {
                    user : currentUser
                },
                relations : ['products','user']
            })
            let product_Ids =  user_products.map((el)=>{
                return el.products.id
            })
            console.log(product_Ids);
            if (product_Ids.length == 0) {
                return new HttpException('У пользователя нет товаров в корзине',HttpStatus.UNPROCESSABLE_ENTITY)
            }
            const queryBuilder = this.productRepository
            .createQueryBuilder('products')
            .where('products.id IN (:...ids)',{ids : product_Ids})
            const products = await queryBuilder.getMany()
            return products
        } catch (error) {

            
        }
        
    } 

    async addProdToBasket(user_id: number, product_id : number){
        const product = await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
        const user = await this.userRepository.findOne({
            where : {
                id : user_id
            }
        })
        if (!product) {
            throw new HttpException('Такого товара еще не существует',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const userWithProduct = await this.basketProduct_Repository.findOne({
            where : {
                user : user,
                products : product
            },
            relations : ['products', 'user']
        })
        if (userWithProduct) {
            throw new HttpException('Эта запись уже существует в корзине',HttpStatus.BAD_REQUEST)
        }
        let Entity = new BasketProductsEntity()
        Entity.user = user
        Entity.products = product
        console.log('Entity', Entity);
        const newBasketItem = await this.basketProduct_Repository.save(Entity)
        return newBasketItem
    }

}
