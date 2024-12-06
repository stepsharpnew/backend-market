import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDTO } from './dto/sendMailDTO';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(@Body()dto : SendMailDTO ){
    return await this.mailService.sendMail(dto)
  }



}
