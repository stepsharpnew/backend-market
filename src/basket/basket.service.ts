import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/products.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { BasketEntity } from './basket.entity';
import { BasketProductsEntity } from 'src/entitys/basket_products.entity';

@Injectable()
export class BasketService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository : Repository<ProductEntity>,
        @InjectRepository(BasketEntity)
        private readonly basketRepository : Repository<BasketEntity>,
        @InjectRepository(BasketProductsEntity)
        private readonly basketProduct_Repository : Repository<BasketProductsEntity>,
        
){}

    async getBasketUser(id : number){
        const user = await this.userRepository.findOne({
            where : {
                id
            }
        })
        if (!user) {
            throw new HttpException('Нет такого пользователя',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const product_Ids = await this.basketProduct_Repository.find({
            where : {
                basketId : id
            },
            relations : ['products','user']
        })

    }

    async createBasket(createBasket : BasketEntity):Promise<BasketEntity>{
        const basket = await this.basketRepository.save(createBasket)
        return basket
    }

    // async getBasketByUserId(user_id : number) {
        
    //     const basket = await this.basketRepository.findOne({
    //         where : {
    //             user : user_id
    //         },
    //         relations : ['user']
    //     })
    //     console.log('basket_id',basket.user);
        
    //     if (!basket) {
    //         throw new HttpException('Нет такой корзины для',HttpStatus.UNPROCESSABLE_ENTITY)
    //     }
    //     return basket.user
    // } 

    async addProdToBasket(user_id: number, product_id : number){
        console.log(user_id,product_id);
        // const basket_id = await this.getBasketByUserId(user_id)
        const product = await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
        if (!product) {
            throw new HttpException('Такого товара еще не существует',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        let Entity = new BasketProductsEntity()
        Entity.basketId = user_id
        Entity.productId = product_id
        const newBasketItem = await this.basketProduct_Repository.save(Entity)
        return newBasketItem
    }

}
