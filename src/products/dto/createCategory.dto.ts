import { IsNotEmpty } from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty()
    category : string 
    
}