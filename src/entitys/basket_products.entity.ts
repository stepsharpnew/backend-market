
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "../products/products.entity";
import { UserEntity } from "../user/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'basket_products'})

export class BasketProductsEntity{
    @ApiProperty({example : "1", description : "АйДи корзины"})
    @PrimaryGeneratedColumn()
    id : number

    
    @ApiProperty({ type: () => UserEntity, description: 'Связанный пользователь' })
    @ManyToOne(()=>UserEntity,(user)=>user.id)
    user : UserEntity

    
    @ApiProperty({ type: () => ProductEntity, description: 'Связанный продукт' })
    @ManyToOne(()=>ProductEntity,(product)=>product.id)
    products : ProductEntity
}