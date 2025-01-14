import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { User } from 'src/user/decorators/UserDecorator';
import { user } from '@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/datasphere';
import { AdminGuard } from 'src/user/guards/AdminGuard';

@Controller('file')
export class FileController {
//   constructor(private readonly fileService: FileService) {}


//   @Post()
//   @UseGuards(AccesTokenGeard,AdminGuard)
//   @UseInterceptors(FileInterceptor('image'))
//   async takeFile(
//     @UploadedFile() file : Express.Multer.File,
//     @User() user : any
// ){
//     return this.fileService.addFileProduct(file,user.sub)
//   }

}
