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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryOptions } from './dto/QueryOptionsDTO';
import { query } from 'express';
import { Binary } from 'typeorm';
import { CategoryEntity } from 'src/entitys/category.entity';
import { FilterService } from 'src/filter/filter.service';
import { FilterDTO } from 'src/filter/filterDTO';

@ApiBearerAuth()
@ApiTags('Продукты')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileService : FileService,
    private readonly filterService : FilterService
  ) {}

  //Получение всех товар
  @ApiOperation({summary : "Все товары"})
  @ApiResponse({status : 200, type : [ProductEntity] })
  @ApiQuery({name : 'limit', required : false})
  @ApiQuery({name : 'offset', required : false})
  @ApiQuery({name : 'price_bottom', required : false})
  @ApiQuery({name : 'price_up', required : false})
  @Get()
  async getAllProducts(
    @Query() dto:QueryOptions,
    @Query()filterDTO : FilterDTO
  ):Promise<ProductEntity[]>{
    const { limit, offset } = dto
    const {price_bottom, price_up}= filterDTO
    const products = await this.productsService.getAllProducts({limit, offset})
    console.log(products.map((el)=>el.id));
    console.log({price_bottom, price_up});
    return products
    
    const filtered = this.filterService.filter(
      products,
      10000,//price_bottom,
      100000//price_up
    )
    return filtered
  }

  //Получение товара
  @ApiOperation({summary : "Один товар"})
  @ApiResponse({status : 200, type : ProductEntity })
  @Get('get/:slug')
  async getProduct(
    @Query() query:any,
    @Param('slug')productname : string
  ):Promise<ProductEntity>{
    const product = await this.productsService.getProductBySlug(productname)
    return product
  }

  //Создание товара
  @ApiOperation({summary : "Добавить товар"})
  @ApiResponse({status : 200, type : ProductEntity })
  @Post('create')
  @UseGuards(AccesTokenGeard,AdminGuard)  
    async createProduct(
      @Body()createProductDTO : CreateProductDTO,
      @User() user:any
    ):Promise<ProductEntity>{
      const product = await this.productsService.createProduct(createProductDTO,user.sub)
      return product
    }

    //удаление товара по слагу
    @ApiOperation({summary : "Удалить товар"})
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
      @ApiOperation({summary : "Получить товары категории"})
      @ApiResponse({status : 200, type : [ProductEntity] })
      @Get('category/:category')
      async getByCategoty(
        @Param('category') category_short_name : string,
      ):Promise<ProductEntity[]>{
        const products = await this.productsService.getProductsByCategoty(category_short_name)
        return products
      } 


      //Созддание фото для продукта
      @ApiOperation({summary : "Добавит фото на товар"})
      @ApiResponse({status : 200, type : ProductEntity })
      @ApiConsumes('multipart/form-data')
      @ApiBody({schema : {
        type : 'object',
        properties : {
          file : {
            type : 'string',
            format : 'binary'
          }
        }
      }})
      @Post('addphoto/:product_slug')
      @UseGuards(AccesTokenGeard,AdminGuard)
      @UseInterceptors(FileInterceptor('file'))
      async takeFile(
        @UploadedFile() file : Express.Multer.File,
        @User() user : any,
        @Param('product_slug') product_slug : string
    ){
        const product_id  = (await this.productsService.getProductBySlug(product_slug)).id
        return this.fileService.addFileProduct(file,user.sub,product_id)
      }

      
      @ApiOperation({summary : "Добавить категорию"})
      @ApiResponse({status : 200, type : CategoryEntity })
      @Post('category')
      @UseGuards(AccesTokenGeard,AdminGuard)
      async createCategory(@Body() createCategoryDTO : CreateCategoryDTO){
        return  this.productsService.createCategory(createCategoryDTO)
          
      }



      @Post('telegram_sale')
      async telegramSaleNotify(
        @Body('chatId') chatId : number
      ){
        return  this.productsService.telegramSaleNotify(chatId)
          
      }


      @ApiOperation({summary : "Все товары по скидке"})
      @ApiResponse({status : 200, type : [ProductEntity] })
      @Get('sales')
      async findProdBySale():Promise<ProductEntity[]>{
        return this.productsService.findProdBySale()
          
      }


      //GUARDS
      @Post('create_sale')
      @UseGuards(AccesTokenGeard, AdminGuard)
      @ApiBody({
        schema : {
          properties : {
            product_id : {example : 1},
            sale : {example : 20}
          }
        }
      })
      async CreateSale(
        @Body('product_id') product_id : number,
        @Body('sale') sale : number,
      ){
        return  this.productsService.CreateSale(product_id, sale)
      }



      @Delete('delete_sale')
      @UseGuards(AccesTokenGeard, AdminGuard)
      @ApiBody({
        schema : {
          properties : {
            product_id : {example : 1},
          }
        }
      })
      async DeleteSale(
        @Body('product_id') product_id : number,
      ){
        return  this.productsService.DeleteSale(product_id)   
      }

      @Get('all_categories')
      async getCategories(){
        return this.productsService.getCategories()   
      }

      // @Get('sales')
      // async GetSales(){
      //   console.log('asdasd');
      //   return await this.productsService.GetSales()
      // }
}
 