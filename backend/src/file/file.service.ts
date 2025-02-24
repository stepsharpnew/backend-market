import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from 'src/products/products.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import "dotenv/config"
import { s3 } from 'src/config/s3.config';


@Injectable()
export class FileService {

    constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository : Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository : Repository<UserEntity>
    ){}

//      PRODUCT ------------------------------------------------------
    //Создание названия и установка параметров
    async addFileProduct(file : Express.Multer.File,user_id : any, product_id : number){
        // // console.log(file);
        
        try {
            const filename = slugify(`${Date.now()}-${file.originalname.slice(0,8)}-${(Math.random()*48).toString(36).substring(2)}`)
            const params = {
                Bucket: 'step2002sharp', 
                Key: filename, 
                Body: file.buffer,
                ContentType: file.mimetype, 
                ACL: 'public-read', 
            };
                return await this.fileToS3(params,product_id)

        } catch (error) {
            // // console.log(error);
            throw new HttpException('Файл не загрузился', HttpStatus.BAD_GATEWAY)
        }
        
    }   





    //Отправка файла в ObjectStorage PRODUCTS
    async fileToS3(params, product_id:number){
          try {
            const data = await s3.upload(params).promise();
            
            return await this.AddProductURL(data.Location, product_id)
          } catch (error) {
            console.error('Error uploading file:', error);
            throw new HttpException('Файл не загрузился', HttpStatus.BAD_GATEWAY)
          }
    }





    //Сохранение URL В БД PRODUCT
    async AddProductURL(url : string, product_id : number){
        const product = await this.productRepository.findOne({
            where : {
                id : product_id
            }
        })
        const new_product = await this.productRepository.save({...product,image_url : url})
        return new_product
    }   



// USER -------------------------------------------------------------------

    //Создание названия и установка параметров USER
    async addFileProductUser(file : Express.Multer.File,user_id : any){
        
        try {
            const filename = slugify(`${Date.now()}-${file.originalname.slice(0,8)}-${(Math.random()*48).toString(36).substring(2)}`)
            const params = {
                Bucket: 'step2002sharp', 
                Key: filename, 
                Body: file.buffer,
                ContentType: file.mimetype, 
                ACL: 'public-read', 
            };
                return await this.fileToS3User(params,user_id)

        } catch (error) {
            // // console.log(error);
            throw new HttpException('Файл не загрузился', HttpStatus.BAD_GATEWAY)
        }
        
    } 


        //Отправка файла в ObjectStorage USER
        async fileToS3User(params, user_id:number){
            try {
              const data = await s3.upload(params).promise();
              return await this.AddProductURLUser(data.Location, user_id)
            } catch (error) {
              console.error('Error uploading file:', error);
              throw new HttpException('Файл не загрузился', HttpStatus.BAD_GATEWAY)
            }
      }


        //Сохранение URL В БД USER
        async AddProductURLUser(url : string, user_id : number){
            const user = await this.userRepository.findOne({
                where : {
                    id : user_id
                }
            })
            const new_user = await this.userRepository.save({...user,image_url : url})
            return new_user
        } 
}
