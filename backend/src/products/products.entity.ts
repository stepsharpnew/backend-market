import { FavoriteEntity } from "../entitys/favorite.entity";
import { BasketProductsEntity } from "../entitys/basket_products.entity";
import { CategoryEntity } from "../entitys/category.entity";

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({name : 'products'})

export class ProductEntity {
    @PrimaryGeneratedColumn()
    id : number

    @ApiProperty({example : "Айфон", description : "Название"})
    @Column()
    name : string

    @ApiProperty({example : 115999, description : "Цена товара"})
    @Column()
    price : number


    @ApiPropertyOptional({example : "url", description : "ссылка на картинку"})
    @Column({default : 'https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg'})
    image_url : string

    @ApiProperty({example : "Товар Товар Товар Товар Товар", description : "Цена товара"})
    @Column()
    description : string

    @ApiProperty({example : "naeasd-asdhgh2", description : "SLUG товара"})
    @Column()
    slug : string

    @ApiProperty({example : true, description : "Есть ли скидка"})
    @Column({default : false})
    saleBool : boolean

    @ApiProperty({example : 20, description : "скидка"})
    @Column({default : 0, nullable : true})
    sale : number

    @ApiProperty({example : 3, description : "Количество проданных"})
    @Column({default : 0})
    sold_count : number

    @OneToMany(()=>FavoriteEntity, (favorites)=>favorites.productList, {nullable : true})
    favorites : FavoriteEntity[]

    @ApiProperty({type : ()=>CategoryEntity, description : "Цена товара"})
    @ManyToOne(()=>CategoryEntity, (category)=>category.products)
    category : CategoryEntity

    @OneToMany(()=>BasketProductsEntity, (product)=> product.products)
    products : ProductEntity
}