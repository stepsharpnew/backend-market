import 'dotenv';
import { getTGChatId } from './getTGChatId';

export const getTelegramConfig = async () => {
    const chatIds = await getTGChatId();

    if (!chatIds || chatIds.length === 0) {
        throw new Error('Failed to retrieve chat IDs. Ensure the bot has received updates.');
    }

    return {
        chatIds, // Массив chatIds
        token: process.env.BOT_TOKEN,
    };
};
