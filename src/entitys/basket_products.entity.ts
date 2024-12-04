
import { ProductEntity } from "../products/products.entity";
import { UserEntity } from "../user/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'basket_products'})

export class BasketProductsEntity{
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=>UserEntity,(user)=>user.id)
    user : UserEntity

    @ManyToOne(()=>ProductEntity,(product)=>product.id)
    products : ProductEntity
}