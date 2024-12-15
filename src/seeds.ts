import { DataSource } from "typeorm";
import { CategoryEntity } from "./entitys/category.entity";
import { ProductEntity } from "./products/products.entity";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "postgres",
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});

async function seed() {
  await dataSource.initialize();
  const categoryRepository = dataSource.getRepository(CategoryEntity);
  const productRepository = dataSource.getRepository(ProductEntity);

  // Сиды для категорий
  const categories = [
    { category: "Электроника", short_name: "Electronika" },
    { category: "Бытовая техника", short_name: "Bytovaya-tehnika" },
    { category: "Компьютеры", short_name: "Computery" },
    { category: "Смартфоны", short_name: "Smartphony" },
  ];

  const savedCategories = await categoryRepository.save(categories);
  console.log("Категории добавлены успешно!");

  // Сиды для продуктов
  const products = [
    {
      name: "Смартфон Samsung Galaxy S23",
      price: 79999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Флагманский смартфон с мощной камерой.",
      slug: "samsung-galaxy-s23",
      category: savedCategories.find((cat) => cat.short_name === "Smartphony"),
    },
    {
      name: "Ноутбук MacBook Air M2",
      price: 99999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Ультратонкий ноутбук с процессором M2.",
      slug: "macbook-air-m2",
      category: savedCategories.find((cat) => cat.short_name === "Computery"),
    },
    {
      name: "Холодильник LG Side-by-Side",
      price: 89999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Современный холодильник с морозильной камерой.",
      slug: "lg-side-by-side",
      category: savedCategories.find((cat) => cat.short_name === "Bytovaya-tehnika"),
    },
    {
      name: "Телевизор Sony Bravia OLED",
      price: 119999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "4K OLED телевизор с насыщенными цветами.",
      slug: "sony-bravia-oled",
      category: savedCategories.find((cat) => cat.short_name === "Electronika"),
    },
    {
      name: "Смарт-часы Apple Watch Series 8",
      price: 39999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Умные часы с функцией ЭКГ.",
      slug: "apple-watch-series-8",
      category: savedCategories.find((cat) => cat.short_name === "Electronika"),
    },
    {
      name: "Планшет iPad Pro 12.9",
      price: 129999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Мощный планшет с экраном Liquid Retina.",
      slug: "ipad-pro-12-9",
      category: savedCategories.find((cat) => cat.short_name === "Computery"),
    },
    {
      name: "Пылесос Dyson V15",
      price: 59999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Беспроводной пылесос с мощной тягой.",
      slug: "dyson-v15",
      category: savedCategories.find((cat) => cat.short_name === "Bytovaya-tehnika"),
    },
    {
      name: "Фен Philips Prestige",
      price: 14999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Фен с ионной технологией.",
      slug: "philips-prestige",
      category: savedCategories.find((cat) => cat.short_name === "Bytovaya-tehnika"),
    },
  ];

  await productRepository.save(products);
  console.log("Продукты добавлены успешно!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Ошибка при выполнении сидов:", err);
  process.exit(1);
});
