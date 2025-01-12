import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegramInterface } from './telegram.interface';
import 'dotenv';
import { getTelegramConfig } from 'src/config/getTelegramConfig';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService implements OnModuleInit {
    bot: Telegraf;
    options: TelegramInterface;

    async onModuleInit() {
        // try {
        //     const config = await getTelegramConfig();
        //     this.options = config;
        //     this.bot = new Telegraf(config.token);
        // } catch (error) {
        //     console.error('Failed to initialize TelegramService:', error.message);
        // }
    }

    async sendMessage(
        msg: string,
        options?: ExtraReplyMessage,
        chatId?: string 
    ) {
        // if (!this.bot) {
        //     throw new Error('Bot is not initialized');
        // }

        // if (chatId) { 
        //     // Если указан конкретный chatId
        //     await this.bot.telegram.sendMessage(chatId, msg, {
        //         parse_mode: 'HTML',
        //         ...options,
        //     });
        // } else {
        //     // Если много chatId, отправляем всем из массива
        //     for (const id of this.options.chatIds) {
        //         await this.bot.telegram.sendMessage(id, msg, {
        //             parse_mode: 'HTML',
        //             ...options,
        //         });
        //     }
        // }
    }

  
}
