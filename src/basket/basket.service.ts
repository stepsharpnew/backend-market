import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/products.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { BasketProductsEntity } from 'src/entitys/basket_products.entity';
import { ZakazEntity } from 'src/zakaz/zakaz.entity';

@Injectable()
export class BasketService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository : Repository<ProductEntity>,
        @InjectRepository(BasketProductsEntity)
        private readonly basketProduct_Repository : Repository<BasketProductsEntity>,
        @InjectRepository(ZakazEntity)
        private readonly zakazRepository : Repository<ZakazEntity>,
        
){}

    async GetUser(user_id : number):Promise<UserEntity>{
        return await this.userRepository.findOne({
            where : {
                id : user_id
            }
        })
    }

    async GetProduct(product_id : number):Promise<ProductEntity>{
        return await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
    }

    async getBasketUser(id : number){
        try {
            const currentUser = await this.GetUser(id)
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
            console.log(error);
            
        }
        
    } 



    async addProdToBasket(user_id: number, product_id : number){
        const product = await this.GetProduct(product_id)
        const user = await this.GetUser(user_id)
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




    //Удаление корзины(всех добавленных связей между пользователем и товарами)
    async deleteBasket(user_id:number){
        const user = await this.GetUser(user_id)
        if (!user) {
            throw new HttpException('Такого пользователя нет',HttpStatus.BAD_REQUEST)
        }
        const basket_items = await this.basketProduct_Repository.find({
            where : {
                user
            },
            relations : ["products", "user"]
        })
        if (!user) {
            throw new HttpException('Чтобы оформить заказ добавьте товары в корзину',HttpStatus.BAD_REQUEST)
        }
        const products_Ids = basket_items.map((elem)=>elem.products.id)
        await this.basketProduct_Repository
        .createQueryBuilder()
        .delete()
        .from('basket_products')
        .where('productsId IN (:...ids)', { ids: products_Ids })
        .andWhere(`userId = ${user_id}`)
        .execute();
    }

    async deleteProdFromBAsket(user_id : number, product_id : number){

    }

    //получить список товаров в корзине, при нажатии кнопки "ПОКУПКА", должна создатьсья запись с юзером и списком его товаров

    async basketToZakaz(user_id: number){
        const user = await this.GetUser(user_id)
        if (!user) {
            throw new HttpException('Такого пользователя нет',HttpStatus.BAD_REQUEST)
        }
        const basket_items = await this.basketProduct_Repository.find({
            where : {
                user
            },
            relations : ["products", "user"]
        })
        if (!user) {
            throw new HttpException('Чтобы оформить заказ добавьте товары в корзину',HttpStatus.BAD_REQUEST)
        }

        const products_Ids = basket_items.map((elem)=>elem.products.id)
        console.log(products_Ids);
        if (products_Ids.length === 0) {
            throw new HttpException('Ваша корзина пустая', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        

        const queryBuilder =  this.productRepository
        .createQueryBuilder('products')
        .where('id IN (:...ids)', { ids: products_Ids })

        let products = await queryBuilder.getMany()
        products.forEach(element => {
            element.sold_count++
        });
        await this.productRepository.save(products)

        let zakaz = new ZakazEntity()
        zakaz.productList = products_Ids
        zakaz.user = user
        const new_zakaz = await this.zakazRepository.save(zakaz)
        this.deleteBasket(user_id)
        return new_zakaz 
    }


    //Если корзина пуста, возниает ошибка ++++++++
}
