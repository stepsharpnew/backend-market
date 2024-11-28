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
        const basket = await this.basketRepository.findOne({
            where : {
                user : user
            }
        })
        const product_Ids = await this.basketProduct_Repository.find({
            where : {
                basketId : basket.id
            },
            relations : ['products']
        })

    }

    async createBasket(createBasket : BasketEntity){
        const basket = await this.basketRepository.save(createBasket)
        return basket
    }

}
