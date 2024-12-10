import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ProductEntity } from 'src/products/products.entity';
import { FavoriteEntity } from 'src/entitys/favorite.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity, ProductEntity, FavoriteEntity])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
