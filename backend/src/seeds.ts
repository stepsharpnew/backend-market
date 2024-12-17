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

  const categories = [
    { category: "Телевизоры", short_name: "Televizory" },
    { category: "Ноутбуки", short_name: "Noutbuki" },
    { category: "Смартфоны", short_name: "Smartfony" },
    { category: "Планшеты", short_name: "Planshety" },
    { category: "Бытовая техника", short_name: "Bytovaya-tehnika" },
  ];
  

  const savedCategories = await categoryRepository.save(categories);
  console.log("Категории добавлены успешно!");

  // Сиды для продуктов
  const products = [
    // Смартфоны
    {
      name: "Смартфон Samsung Galaxy S23",
      price: 79999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Флагманский смартфон с мощной камерой.",
      slug: "samsung-galaxy-s23",
      category: savedCategories.find((cat) => cat.short_name === "Smartfony"),
    },
    {
      name: "Смартфон iPhone 15 Pro",
      price: 129999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Премиальный смартфон с чипом A17 Pro.",
      slug: "iphone-15-pro",
      category: savedCategories.find((cat) => cat.short_name === "Smartfony"),
    },
    {
      name: "Смартфон Xiaomi Redmi Note 13",
      price: 29999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Доступный смартфон с большой батареей.",
      slug: "xiaomi-redmi-note-13",
      category: savedCategories.find((cat) => cat.short_name === "Smartfony"),
    },
    // Ноутбуки
    {
      name: "Ноутбук MacBook Air M2",
      price: 99999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Ультратонкий ноутбук с процессором M2.",
      slug: "macbook-air-m2",
      category: savedCategories.find((cat) => cat.short_name === "Noutbuki"),
    },
    {
      name: "Ноутбук ASUS ROG Zephyrus G14",
      price: 139999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Игровой ноутбук с мощной графикой RTX.",
      slug: "asus-rog-zephyrus-g14",
      category: savedCategories.find((cat) => cat.short_name === "Noutbuki"),
    },
    {
      name: "Ноутбук Lenovo IdeaPad 3",
      price: 54999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Доступный ноутбук для учебы и работы.",
      slug: "lenovo-ideapad-3",
      category: savedCategories.find((cat) => cat.short_name === "Noutbuki"),
    },
    // Телевизоры
    {
      name: "Телевизор Sony Bravia OLED",
      price: 119999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "4K OLED телевизор с насыщенными цветами.",
      slug: "sony-bravia-oled",
      category: savedCategories.find((cat) => cat.short_name === "Televizory"),
    },
    {
      name: "Телевизор LG NanoCell",
      price: 79999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Телевизор с технологией NanoCell для ярких цветов.",
      slug: "lg-nanocell",
      category: savedCategories.find((cat) => cat.short_name === "Televizory"),
    },
    {
      name: "Телевизор Samsung QLED 8K",
      price: 249999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Телевизор премиум-класса с разрешением 8K.",
      slug: "samsung-qled-8k",
      category: savedCategories.find((cat) => cat.short_name === "Televizory"),
    },
    // Планшеты
    {
      name: "Планшет iPad Pro 12.9",
      price: 129999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Мощный планшет с экраном Liquid Retina.",
      slug: "ipad-pro-12-9",
      category: savedCategories.find((cat) => cat.short_name === "Planshety"),
    },
    {
      name: "Планшет Samsung Galaxy Tab S9",
      price: 94999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Высокопроизводительный планшет для работы и развлечений.",
      slug: "samsung-galaxy-tab-s9",
      category: savedCategories.find((cat) => cat.short_name === "Planshety"),
    },
    {
      name: "Планшет Xiaomi Pad 6",
      price: 42999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Стильный планшет с большим экраном.",
      slug: "xiaomi-pad-6",
      category: savedCategories.find((cat) => cat.short_name === "Planshety"),
    },
    // Бытовая техника
    {
      name: "Пылесос Dyson V15",
      price: 59999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Беспроводной пылесос с мощной тягой.",
      slug: "dyson-v15",
      category: savedCategories.find((cat) => cat.short_name === "Bytovaya-tehnika"),
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
      name: "Стиральная машина Bosch Serie 6",
      price: 49999,
      image_url: "https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg",
      description: "Энергоэффективная стиральная машина с тихой работой.",
      slug: "bosch-serie-6",
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
