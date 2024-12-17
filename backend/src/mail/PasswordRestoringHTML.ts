export default ((authCode)=>{

return    `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ваш новый пароль</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f0f4f8;
              color: #333;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              font-size: 16px;
            }
            h1 {
              font-size: 28px;
              color: #4CAF50;
              text-align: center;
              margin-bottom: 20px;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #FF5722;
              background-color: #FFF3E0;
              padding: 15px 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
              letter-spacing: 2px;
            }
            .message {
              color: #555;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .footer {
              font-size: 14px;
              text-align: center;
              color: #888;
              margin-top: 30px;
            }
            .footer a {
              color: #007BFF;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
            .cta-button {
              display: inline-block;
              padding: 12px 25px;
              background-color: #4CAF50;
              color: white;
              font-size: 16px;
              font-weight: bold;
              border-radius: 8px;
              text-align: center;
              text-decoration: none;
              margin: 20px 0;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .cta-button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Ваш код аутентификации</h1>
            <p class="message">Здравствуйте!</p>
            <p class="message">Мы получили запрос на сброс пароля для вашего аккаунта. Чтобы продолжить, используйте следующий код аутентификации:</p>
            <div class="code">${authCode}</div>
            <p class="message">Пожалуйста, введите этот код на странице для завершения процесса сброса пароля.</p>
            
            <a href="#" class="cta-button">Перейти на страницу сброса</a>

            <div class="footer">
              <p>С уважением, команда поддержки</p>
              <p>Если вы не запрашивали код, проигнорируйте это письмо.</p>
              <p><a href="https://example.com">Посетите наш сайт</a> для дополнительной помощи.</p>
            </div>
          </div>
        </body>
        </html>
      `
}) 