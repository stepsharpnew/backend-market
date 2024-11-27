import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AnyARecord } from 'dns';
import { ProductEntity } from './products.entity';
import { CreateProductDTO } from './dto/createProduct.dto';
import { User } from 'src/user/decorators/UserDecorator';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateCategoryDTO } from './dto/createCategory.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async getAllProducts(
    @Query() query:AnyARecord
  ):Promise<ProductEntity[]>{
    const products = await this.productsService.getAllProducts(query)
    return products
  }


  @Get(':slug')
  async getProduct(
    @Query() query:any,
    @Param('slug')productname : string
  ):Promise<ProductEntity>{
    const product = await this.productsService.getProductBySlug(productname)
    return product
  }


  @Post('create')
  @UseGuards(AccesTokenGeard)  
    async createProduct(
      @Body()createProductDTO : CreateProductDTO,
      @User('id') id:number
    ):Promise<ProductEntity>{
      const product = await this.productsService.createProduct(createProductDTO,id)
      return product
    }

    @Delete('delete/:slug')
    @UseGuards(AccesTokenGeard)  
      async deleteBySlug(
        @Param('slug') slug : string,
        @User('id') id:number
      ){
        const product = await this.productsService.deleteBySlug(slug,id)
        console.log(product);
        
        return product
      }

      @Get('category/:category')
      async getByCategoty(
        @Param('category') category_short_name : string,
        // @Param('slug') slug :string
      ):Promise<ProductEntity[]>{
        
        const products = await this.productsService.getProductsByCategoty(category_short_name)
        return products
      }

      @Post('category')
      @UseGuards(AccesTokenGeard)
      async createCategory(@Body() createCategoryDTO : CreateCategoryDTO){
        return  this.productsService.createCategory(createCategoryDTO)
          
      }
}
