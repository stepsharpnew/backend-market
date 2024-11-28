import { BasketEntity } from "src/basket/basket.entity";
import { ProductEntity } from "src/products/products.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'basket_products'})

export class BasketProductsEntity{
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=>BasketEntity,(basket)=>basket.id)
    basketId : number

    @ManyToOne(()=>ProductEntity,(product)=>product.id)
    productId : number
}