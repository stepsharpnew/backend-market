import * as AWS from 'aws-sdk';
import "dotenv/config"

export const s3 = new AWS.S3({
    endpoint: 'https://storage.yandexcloud.net', // Yandex Cloud endpoint
    accessKeyId: process.env.ID_KEY_OBJECT_STORAGE ,  // Замените на ваш Access Key ID
    secretAccessKey: process.env.SECRET_KEY_OBJECT_STORAGE,  // Замените на ваш Secret Access Key
    region: 'ru-central1', 
    signatureVersion: 'v4',
  });