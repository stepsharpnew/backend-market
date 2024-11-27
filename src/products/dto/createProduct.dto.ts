import { IsNotEmpty } from "class-validator"
import { CategoryEntity } from "src/entitys/category.entity"

export class CreateProductDTO{
    @IsNotEmpty()
    name : string

    image_url : string

    @IsNotEmpty()
    price : number

    @IsNotEmpty()
    category : CategoryEntity

    @IsNotEmpty()
    description : string

}