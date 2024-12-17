import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/products.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { FavoriteEntity } from 'src/entitys/favorite.entity';

@Injectable()
export class FavoriteService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository : Repository<ProductEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(FavoriteEntity)
        private readonly favoritesRepository : Repository<FavoriteEntity>,
    ){}

    async getUserById(user_id:number){
        return await this.userRepository.findOne({
            where : {
                id : user_id
            }
        })
    }
    async getuserFavorites(user:UserEntity){
        return await this.favoritesRepository.findOne({
            where : {
                user
            }
        })
    }
    async getProdBYId(product_id : number){
        return await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
    }

    async createFavorite(user_id : any, product_id : number){
        const user = await this.getUserById(user_id)
        if (!user) {
            throw new HttpException('Такого пользователя нет',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        
        if (!await this.getProdBYId(product_id)) {
            throw new HttpException('Такого товара нет',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        let userFavoriteItems = await this.getuserFavorites(user)
        if (!userFavoriteItems) {
            // Если записи для пользователя нет, создаём новую
            const newFavoriteRecord = new FavoriteEntity();
            newFavoriteRecord.productList = [product_id];
            newFavoriteRecord.user = user;
            console.log('первая', newFavoriteRecord);
            return await this.favoritesRepository.save(newFavoriteRecord);
        } else {
            //Если запись уже есть
            const favoritesIds = userFavoriteItems.productList;
            let arrayToString:string[] = []
            favoritesIds.forEach((elem)=>{
                arrayToString.push(elem.toString())
            })
            if (!arrayToString.includes(product_id.toString())) {
                favoritesIds.push(product_id);
                userFavoriteItems.productList = favoritesIds;
                return await this.favoritesRepository.save(userFavoriteItems);
            } else {
                //Если товар уже в любимом
                throw new HttpException('Этот товар уже добавлен в любимое',HttpStatus.BAD_REQUEST)
            }
        }

    }

    async getFavorites(user_id:number){
        const user = await this.getUserById(user_id)
        const favorites = await this.getuserFavorites(user)
        if (!favorites) {
            return []
        }
        const favoritesIds = favorites.productList
        console.log(favoritesIds);
        const queryBuilder = this.productRepository.createQueryBuilder('products')
        .andWhereInIds(favoritesIds)
        const products = await queryBuilder.getMany()
        return products
    }
}
