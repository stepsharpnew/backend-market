import { FavoriteEntity } from "../entitys/favorite.entity";
import { BasketProductsEntity } from "../entitys/basket_products.entity";
import { ZakazEntity } from "../zakaz/zakaz.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({name : 'users'})

export class UserEntity{

    @PrimaryGeneratedColumn()
    id : number
    @ApiProperty({example : "shalkin02@inbox.ru", description : "Почта пользователя"})
    @Column()
    email : string

    @ApiProperty({example : "12345", description : "Пароль пользователя"})
    @Column()
    password : string

    @ApiPropertyOptional({example : "Картинка пользователя", description : "Аватарка"})
    @Column({default : ''})
    image_url : string

    @ApiProperty({example : "user", description : "Роль пользователя"})
    @Column({default : 'user'})
    role : string

    @ApiPropertyOptional({example : "123456", description : "Временный код авторизации"})
    @Column({default : 'user',nullable : true})
    single_password : string


    @ApiPropertyOptional({example : "512331233", description : "ChatId для уведомлений"})
    @Column({nullable : true})
    telegram : string


    @ApiPropertyOptional({example : "2yasdasdasdasd", description : "Рефреш токен"})
    @Column({default : '',nullable : true})
    refreshToken : string
 
    
    @OneToMany(()=>FavoriteEntity, (favorites)=>favorites.user)
    favorites : number

    @OneToMany(()=>BasketProductsEntity, (basket)=>basket.user)
    user : UserEntity

    @OneToMany(()=>ZakazEntity, (zakaz)=>zakaz.user)
    zakazy : ZakazEntity[]
}