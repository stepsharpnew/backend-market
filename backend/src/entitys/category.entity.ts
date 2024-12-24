import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "../products/products.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name : 'categories'})

export class CategoryEntity{

    @PrimaryGeneratedColumn()
    id : number


    @ApiProperty({example : "Электроника", description : "Название категории"})
    @Column()
    category : string

    @ApiProperty({example : "http://example.com", description : "Ссылка на товар"})
    @Column()
    image_url : string

    @ApiProperty({example : "Elektronika", description : "SLUG категории"})
    @Column()
    short_name : string

    @OneToMany(()=> ProductEntity, (product)=>product.category)
    products : ProductEntity[]
}