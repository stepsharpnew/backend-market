const { Telegraf, Markup, session, Scenes } = require('telegraf');
require('dotenv').config();


const bot_token = process.env.BOT_TOKEN;
const bot = new Telegraf(bot_token);
const { start, help, scene_enter, sheduler } = require('./actions/actions');
const RegScene = require('./scenes/registrationScene');

const stage = new Scenes.Stage([RegScene]);
bot.use(session());
bot.use(stage.middleware());

// Обработчик команды /start

bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData === 'scene_enter') {
        await ctx.answerCbQuery(); // Убирает "загрузка..." на кнопке
        await ctx.scene.enter('reg'); // Войти в сцену
    }
});

// Обработчик команды /reg
bot.command('reg', scene_enter);
bot.command('help',help)
bot.start(start);


// Запуск бота
bot.launch()
    .then(() => console.log('Bot started'))
    .catch(err => console.error(err));

module.exports = { bot };
