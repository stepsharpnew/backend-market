# Интернет-магазин электронной техники

Это современный интернет-магазин, предоставляющий удобный способ покупки электронной техники с функционалом для управления товарами, пользователями и уведомлениями.

## Функционал

### Для пользователей
- **Просмотр цен и изображений товаров**.
- **Регистрация и авторизация** для покупок и добавления товаров в корзину.
- Добавление товаров в **корзину** и их покупка.
- Перенос оплаченных товаров в **раздел заказов**.
- Добавление товаров в **избранное**.
- Подписка на уведомления через **Telegram-бот**:
  - Уведомления о скидках на избранные товары.
- Восстановление пароля через **отправку кода аутентификации на email**.

### Для администратора
- **Управление пользователями**:
  - Удаление пользователей.
  - Бан пользователей.
- **Управление товарами**:
  - Редактирование карточек товаров.

### Дополнительные возможности
- **Кэширование данных** для ускорения работы:
  - Хранение частых запросов.
  - Управление сроками жизни переменных авторизации.
- **Хранение фотографий** товаров в **S3-облаке Яндекс Cloud**.

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/stepsharpnew/backend-market.git
2. Установка зависимостей для backend 
	```bash
	cd backend
	npm i
3. Установка зависимостей для frontend
	```bash
	cd frontend
	npm i
4. Создания файла .env на стороне сервера
	```env
	PORT=5000
	JWT_SECRET=''
	JWT_ACCESS_SECRET=''
	JWT_REFRESH_SECRET=''
	ID_KEY_OBJECT_STORAGE = ""
	SECRET_KEY_OBJECT_STORAGE = ""
	TYPE='postgres'
	HOST='localhost'
	DB_PORT=5432
	USERNAME='postgres'
	PASSWORD='12345678'
	DATABASE='postgres'
	MAIL_USERNAME="example.com"
	MAIL_PASSWORD="Выдается в личном аккаунте почты"
	BOT_TOKEN=""
	BACKEND="http://localhost для работы в docker-compose"
5. Установка и запуск docker образа postgres
	```bash
	sudo docker run --name postgres-image -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres
6. Запуск docker-compose
	```bash
	sudo docker compose up --build
7. Добавление данных
	sudo docker compose exec backend npm run db:migrate
	sudo docker compose exec backend npm run db:seed

Ваш docker-compose развернут, приложение доступно по адресу http://localhost