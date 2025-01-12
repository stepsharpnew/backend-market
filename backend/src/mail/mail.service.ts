import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDTO } from './dto/sendMailDTO';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(dto : SendMailDTO ){
    try {
      
      const mail = await this.mailerService.sendMail(
        dto 
      )
      return mail
    } catch (error) {
      console.log(error);
      return error
    }

  }
}
