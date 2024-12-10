import { FavoriteEntity } from "../entitys/favorite.entity";
import { BasketProductsEntity } from "../entitys/basket_products.entity";
import { CategoryEntity } from "../entitys/category.entity";

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'products'})

export class ProductEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column()
    price : number

    @Column({default : ''})
    image_url : string

    @Column()
    description : string

    @Column()
    slug : string

    @Column({default : 0})
    sold_count : number

    @OneToMany(()=>FavoriteEntity, (favorites)=>favorites.productList, {nullable : true})
    favorites : FavoriteEntity[]

    @ManyToOne(()=>CategoryEntity, (category)=>category.products)
    category : CategoryEntity

    @OneToMany(()=>BasketProductsEntity, (product)=> product.products)
    products : ProductEntity

    // @OneToMany(()=>ZakazEntity, (zakaz)=> zakaz.products)
    // products_info : ProductEntity
    //celler_id
    //category_id
}