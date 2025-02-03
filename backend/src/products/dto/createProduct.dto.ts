import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { CategoryEntity } from "src/entitys/category.entity"

export class CreateProductDTO{

    @ApiProperty({example : "Айфон_17", description : "АйДи товара"})
    @IsNotEmpty()
    name : string

    @ApiPropertyOptional({example : "url", description : "ссылка на картинку"})
    image_url : string


    @ApiProperty({example : 115999, description : "Цена товара"})
    price : number


    // @ApiProperty({type : ()=>CategoryEntity, description : "Цена товара"})
    // @IsNotEmpty()
    // category : CategoryEntity

    @ApiProperty({example : "Televisions", description : "Цена товара"})
    @IsNotEmpty()
    category : string

    @ApiProperty({example : "Товар Товар Товар Товар Товар", description : "Цена товара"})
    @IsNotEmpty()
    description : string

}