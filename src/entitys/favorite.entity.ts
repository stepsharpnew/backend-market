import { ProductEntity } from "../products/products.entity";
import { UserEntity } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'favorites'})
export class FavoriteEntity{
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=>UserEntity, (user)=>user.favorites)
    user : UserEntity

    
    @Column('simple-array', {nullable : true, default : []})
    productList: number[];

}