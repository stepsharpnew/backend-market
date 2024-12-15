import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { AdminGuard } from 'src/user/guards/AdminGuard';
import { User } from 'src/user/decorators/UserDecorator';


@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,

  ) {}

  @Post('like')
  @UseGuards(AccesTokenGeard)
  async createFavorite(
    @User() user : any,
    @Body('product_id') product_id : number
  ){
    return  this.favoriteService.createFavorite(user.sub,product_id)
  }


  @Get()
  @UseGuards(AccesTokenGeard)
  async takeFavorites(
    @User() user : any,
  ){
    return  this.favoriteService.getFavorites(user.sub)
  }
}
