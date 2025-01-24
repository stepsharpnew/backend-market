const  {CronJob} = require('cron')
const  axios = require('axios')
require('dotenv').config()
const start = async (ctx) => {
    try {
        const userName = ctx.message.from.first_name || "пользователь";
        console.log(`${userName} начал использование бота!`);
        
        // Красивое приветственное сообщение
        await ctx.reply(`
✨ <b>Добро пожаловать, ${userName}!</b> ✨  
Этот бот поможет вам отслеживать скидки на ваши любимые товары.  
Чтобы начать, зарегистрируйтесь с помощью команды <b>/reg</b>.  

<b>📖 Пример:</b>  
1️⃣ Добавьте товары в список любимых.  
2️⃣ Получайте уведомления о скидках, как только они появятся! 🎉  

Не упустите возможность покупать выгодно! 💸  
    `, { parse_mode: "HTML" });

    } catch (error) {
        console.log(`Ошибка при запуске бота: ${error.message}`);
        ctx.reply("Произошла ошибка при запуске. Попробуйте ещё раз позже.");
    }
};


const scene_enter = ctx => {
    ctx.scene.enter('reg')
}

let currentCtx = null; 
let bufferData = [] 
let currentData = []

const messageHandler = (ctx) => {
    currentCtx = ctx; 
    sheduler(ctx); 
};

const formatTelegramMessage = (product) => {
    return `
✨ *Добавили скидку на товар, интересующий вас!* ✨

🛍 *${product.name}*

💰 *Старая цена:* ~${product.price} ₽~  
🔥 *Новая цена:* ${Math.round(product.price * ((100 - product.sale) / 100))} ₽

Не упустите возможность! 🎉
    `;
};



const bufferFunctionPrint = (current, buffer) => {
    if (current.length) {
        console.log(current.length, buffer.length);
        console.log(buffer.length > 0 ? buffer[0].id : -1);

        if (current[current.length - 1].id !== (buffer.length > 0 ? buffer[buffer.length - 1].id : -1)) {
            if (!buffer.length) {
                current.forEach((element) => {
                    console.log(element);
                    
                    currentCtx.sendPhoto(element.category.image_url, {
                        caption: formatTelegramMessage(element),
                        parse_mode: "Markdown",
                    });
                });
            } else {
                const lastProduct = current[current.length - 1];
                currentCtx.sendPhoto(lastProduct.category.image_url, {
                    caption: formatTelegramMessage(lastProduct),
                    parse_mode: "Markdown",
                });
            }
            buffer = current;
            return buffer;
        }
        return buffer;
    }
    return [];
};

 
const job = new CronJob(
    '* * * * * *', 
    async () => {
        if (currentCtx) {
            const chatId = currentCtx.update?.message?.chat.id;
            const port = process.env.PORT;
            const address = process.env.BACKEND;
            const url = process.env.URL
            const change = await axios.post(`${url}/products/telegram_sale`, {
                chatId: chatId
            });
            currentData = change.data 
            bufferData = bufferFunctionPrint(currentData, bufferData)
        } else {
            console.log('Контекст не найден');
        }
    },
    null,
    false, 
    'America/Los_Angeles' 
);

// Функция для установки контекста
const sheduler = (ctx) => {
    if (ctx) {
        currentCtx = ctx; // сохраняем контекст
        console.log('Контекст установлен');
        job.start(); // запускаем CronJob
    }
};




const help = (ctx) => {
    ctx.reply(
        `
✨ <b>БОТ «Создание уведомлений»</b> ✨  
Добро пожаловать! Этот бот уведомляет вас о скидках на товары, которые вы пометили как любимые. Получайте обновления вовремя и не упускайте выгодные предложения!  

<b>📋 Что умеет бот:</b>  
• Автоматически отслеживать скидки на любимые товары.  
• Уведомлять вас о новых выгодных предложениях.  
• Предоставлять полную информацию о товарах со скидкой, включая цену, изображение и описание.

<b>💡 Как это работает:</b>  
1️⃣ Зарегистрируйтесь, указав свой <b>Email</b> (команда: <code>/reg</code>).  
2️⃣ Добавьте товары в список любимых.  
3️⃣ Получайте уведомления о скидках в режиме реального времени! 🎉  

<b>📌 Пример уведомления:</b>  
• Товар: <b>Смартфон XYZ</b>  
• Старая цена: ~79,999 ₽~  
• Новая цена: 59,999 ₽  
Не упустите скидку!  

<b>📖 Команды для использования:</b>  
• <code>/reg</code> — Зарегистрироваться и указать Email.  
• <code>/help</code> — Показать это справочное сообщение.  

<b>⚙️ Попробуйте прямо сейчас!</b>  
Нажмите кнопку ниже, чтобы зарегистрироваться:  
        `, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{ text: "Хочу получать уведомления", callback_data: "scene_enter" }]
            ]
        }
    });
};



module.exports = {
    start,
    help,
    scene_enter,
    sheduler
}