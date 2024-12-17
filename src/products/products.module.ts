import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { CategoryEntity } from 'src/entitys/category.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { CacheService } from 'src/config/cacheService';
import { CacheModule } from '@nestjs/cache-manager';
import { FavoriteEntity } from 'src/entitys/favorite.entity';
import { UserEntity } from 'src/user/user.entity';
import * as redisStore from  'cache-manager-redis-store'

@Module({
  imports : [TypeOrmModule.forFeature([
    ProductEntity,
    CategoryEntity,
    UserModule,
    FavoriteEntity,
    UserEntity
  ]),
  FileModule,
  CacheModule.register({
    // store: redisStore,
    // host: 'localhost',
    // port: 6379,
    ttl: 600,
  }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService,CacheService],
})
export class ProductsModule {}
