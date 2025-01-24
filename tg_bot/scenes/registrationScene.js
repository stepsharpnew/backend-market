const { Scenes } = require('telegraf');
const axios = require('axios');
require('dotenv').config()
const { sheduler } = require('../actions/actions')
const {help, start} = require('../actions/actions')
// Создаем сцену регистрации
const RegScene = new Scenes.BaseScene('reg');

// Вход в сцену
RegScene.enter(async (ctx) => {
    try {
        const user_name = ctx.from?.first_name || 'Гость';
        console.log(`${user_name} вошел в сцену регистрации.`);
        ctx.reply('Введите адрес электронной почты, используемый в приложении:');
    } catch (error) {
        console.error('Ошибка при входе в сцену:', error);
        ctx.reply('Произошла ошибка. Попробуйте снова.');
    }
}); 

// Обработка ввода email

RegScene.on('text', async (ctx) => {
    if (ctx.message.text === '/help') {
        help(ctx)
        return ctx.scene.leave();
    }
    if (ctx.message.text === '/start') {
        start(ctx)
        return ctx.scene.leave();
    }
    const email = ctx.message.text;

    // Проверяем корректность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        ctx.reply('Пожалуйста, введите корректный адрес электронной почты.');
        return;
    }

    try {
        // Выполняем запрос на ваш бэкенд
        const port = process.env.PORT
        const addres = process.env.BACKEND
        const url = process.env.URL
        // const response = await axios.post(`${addres}:${port}/user/tg-email/${email}`);
        const response = await axios.post(`${url}/user/tg-email/${email}`);
        if (response.data ==="Нет пользователя с такой почтой") {
            setTimeout(()=>{
                ctx.reply(`Нет пользователя с такой почтой`);
                console.log(`Нет пользователя с такой почтой`);
                ctx.scene.leave();
                return
            },1)

        }   
        //Определяем почту пользователя
        const user = response.data;
        if (user) {
            setTimeout(async() => {
                console.log(ctx.update?.message.chat.id);

                // const setChatId = await axios.post(`${addres}:${port}/user/add-chat-id`,{
                const setChatId = await axios.post(`${url}/user/add-chat-id`,{
                    email,
                    chatId : ctx.update?.message.chat.id
                })
                if (setChatId.data==="Нет пользователя с такой почтой") {
                    return
                }
                
                ctx.reply(`Добро пожаловать, ${user}! Вы успешно зарегистрированы. Теперь вам будут приходить уведомления`);
                console.log(`Пользователь найден: ${user}`);
                sheduler(ctx)
                ctx.scene.leave();
            }, 1000);
        }
    } catch (error) {
        console.error('Ошибка при проверке email:', error);
        ctx.reply('Произошла ошибка при проверке. Попробуйте позже.');
        ctx.scene.leave();
    }



});


RegScene.leave((ctx) => {
    // ctx.reply('Вы вышли из процесса регистрации');
});


module.exports = RegScene;
