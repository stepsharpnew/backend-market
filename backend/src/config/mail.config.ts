import 'dotenv/config'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

    export default {
        transport: {
            host: 'smtp.yandex.ru',
                port: 587,
                    secure: false, // upgrade later with STARTTLS
                        auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        },

        // defaults: {
        //     from: '"nest-modules" <modules@nestjs.com>',
        // },
        // template: {
        //     dir: process.cwd() + '/templates/',
        //         adapter: new HandlebarsAdapter(), // or new PugAdapter()
        //             options: {
        //         strict: true,
        // },
        // },
    }
