import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDTO {

    
    @ApiProperty({example : "Электроника", description : "Название категории"})
    @IsNotEmpty()
    category : string 
    
}