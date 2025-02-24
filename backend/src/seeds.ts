import { DataSource } from "typeorm";
import { CategoryEntity } from "./entitys/category.entity";
import { ProductEntity } from "./products/products.entity";
import {products, categories} from "./config/seed_data"

const dataSource = new DataSource({
  type: "postgres",
  host: "postgres-image",
  // host : 'localhost',
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


  await categoryRepository.save(categories);
  // console.log("Категории добавлены успешно!");

  await productRepository.save(products);
  // console.log("Продукты добавлены успешно!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Ошибка при выполнении сидов:", err);
  process.exit(1);
});
