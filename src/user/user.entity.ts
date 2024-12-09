import { BasketProductsEntity } from "../entitys/basket_products.entity";
import { ZakazEntity } from "../zakaz/zakaz.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'users'})

export class UserEntity{

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    email : string

    @Column()
    password : string

    @Column({default : ''})
    image_url : string

    @Column({default : 'user'})
    role : string

    @Column({nullable : true})
    single_password : string

    @Column({nullable : true})
    telegram : string

    @Column({default : '',nullable : true})
    refreshToken : string

    @OneToMany(()=>BasketProductsEntity, (basket)=>basket.user)
    user : UserEntity

    @OneToMany(()=>ZakazEntity, (zakaz)=>zakaz.user)
    zakazy : ZakazEntity[]
}