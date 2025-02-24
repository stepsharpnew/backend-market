import axios from "axios";
import "dotenv/config"
export const getTGChatId = async () => {
    try {
        const response = await axios.get(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`
        );

        if (!response.data?.result || response.data.result.length === 0) {
            console.error('No updates available');
            return null; // Возвращаем null, если обновлений нет
        }

        const chatIds = response.data.result.map((message)=>message.message?.chat?.id)
        // // console.log('response', chatIds);
        return chatIds;
    } catch (error) {
        console.error('Error fetching chat ID:', error.message);
        return null; // Возвращаем null в случае ошибки
    }
};