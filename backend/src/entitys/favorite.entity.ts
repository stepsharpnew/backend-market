import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "../products/products.entity";
import { UserEntity } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'favorites'})
export class FavoriteEntity{
    @PrimaryGeneratedColumn()
    id : number

    @ApiProperty({type : ()=>UserEntity , description : "Пользователь"})
    @ManyToOne(()=>UserEntity, (user)=>user.favorites)
    user : UserEntity

    
    @ApiProperty({type : ()=>ProductEntity , description : "Массив избранных товаров пользователя"})
    @Column('simple-array', {nullable : true, default : []})
    productList: number[];

}