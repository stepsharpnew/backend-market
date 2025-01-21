
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "../products/products.entity";
import { UserEntity } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'basket_products'})

export class BasketProductsEntity{
    @ApiProperty({example : "1", description : "АйДи корзины"})
    @PrimaryGeneratedColumn()
    id : number

    
    @ApiProperty({ type: () => UserEntity, description: 'Связанный пользователь' })
    @ManyToOne(()=>UserEntity,(user)=>user.id)
    // @JoinColumn({ name: 'user_id' }) // Явно указываем имя колонки
    user : UserEntity


    @ApiProperty({example : 2, description : "Количество"})
    @Column({default : 1, nullable : true})
    count: number; 


    @ApiProperty({ type: () => ProductEntity, description: 'Связанный продукт' })
    @ManyToOne(() => ProductEntity, (product) => product.basketProducts)
    products: ProductEntity;


    
}