import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AnyARecord } from 'dns';
import { ProductEntity } from './products.entity';
import { CreateProductDTO } from './dto/createProduct.dto';
import { User } from 'src/user/decorators/UserDecorator';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { AdminGuard } from 'src/user/guards/AdminGuard';
import { UserGuard } from 'src/user/guards/UserGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileService : FileService
  ) {}

  //Получение всех товар
  @Get()
  async getAllProducts(
    @Query() query:AnyARecord
  ):Promise<ProductEntity[]>{
    const products = await this.productsService.getAllProducts(query)
    return products
  }

  //Получение товара
  @Get(':slug')
  async getProduct(
    @Query() query:any,
    @Param('slug')productname : string
  ):Promise<ProductEntity>{
    const product = await this.productsService.getProductBySlug(productname)
    return product
  }

  //Создание товара
  @Post('create')
  @UseGuards(AccesTokenGeard,AdminGuard)  
    async createProduct(
      @Body()createProductDTO : CreateProductDTO,
      @User() user:any
    ):Promise<ProductEntity>{
      console.log(user);
      const product = await this.productsService.createProduct(createProductDTO,user.sub)
      return product
    }

    //удаление товара по слагу
    @Delete('delete/:slug')
    @UseGuards(AccesTokenGeard,AdminGuard)  
      async deleteBySlug(
        @Param('slug') slug : string,
        @User('id') id:number
      ){
        const product = await this.productsService.deleteBySlug(slug,id)
        console.log(product);
        
        return product
      }

      //Получение товаров этой категории
      @Get('category/:category')
      async getByCategoty(
        @Param('category') category_short_name : string,
        // @Param('slug') slug :string
      ):Promise<ProductEntity[]>{
        
        const products = await this.productsService.getProductsByCategoty(category_short_name)
        return products
      }


      //Созддание фото для продукта
      @Post('addphoto/:product_slug')
      @UseGuards(AccesTokenGeard,AdminGuard)
      @UseInterceptors(FileInterceptor('image'))
      async takeFile(
        @UploadedFile() file : Express.Multer.File,
        @User() user : any,
        @Param('product_slug') product_slug : string
    ){
        const product_id  = (await this.productsService.getProductBySlug(product_slug)).id
        console.log('productID ' + product_id);
        return this.fileService.addFileProduct(file,user.sub,product_id)
      }

      
      // Добавление категории
      @Post('category')
      @UseGuards(AccesTokenGeard,AdminGuard)
      async createCategory(@Body() createCategoryDTO : CreateCategoryDTO){
        return  this.productsService.createCategory(createCategoryDTO)
          
      }
}
