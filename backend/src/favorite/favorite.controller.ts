import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { AdminGuard } from 'src/user/guards/AdminGuard';
import { User } from 'src/user/decorators/UserDecorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoriteEntity } from 'src/entitys/favorite.entity';
import { ProductEntity } from 'src/products/products.entity';


@ApiBearerAuth()
@ApiTags('Избранное')
@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,

  ) {}

  @ApiOperation({summary : "Добавление в избранное"})
  @ApiResponse({status : 200, type : FavoriteEntity })
  @ApiBody({
    schema : {
      properties : {product_id : {example : 1}}
    }
  })
  @Post('like')
  @UseGuards(AccesTokenGeard)
  async createFavorite(

    @User() user : any,
    @Body('product_id') product_id : number
  ){
    return  this.favoriteService.createFavorite(user.sub,product_id)
  }

  @ApiOperation({summary : "Избранное пользователя"})
  @ApiResponse({status : 200, type : [ProductEntity] })
  @UseGuards(AccesTokenGeard)
  @Get()
  async takeFavorites(
    @User() user : any,
  ){
    return  this.favoriteService.getFavorites(user.sub)
  }


  @ApiOperation({summary : "Удаление избранного товара"})
  @ApiResponse({status : 200, type : [ProductEntity] })
  @ApiQuery({schema : {properties : {product_id : { example : 1}}}})
  @UseGuards(AccesTokenGeard)
  @Delete()
  async deleteFavorites(
    @User() user : any,
    @Query('product_id') product_id : number
  ){
    return this.favoriteService.deleteFavorite(user.sub, product_id)
  }


}
