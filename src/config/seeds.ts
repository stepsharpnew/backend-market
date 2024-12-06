import { DataSource } from "typeorm";
import { CategoryEntity } from "../entitys/category.entity";


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

  const categories = [
    { category: "Электроника", short_name : "Electronika"},
    { category: "Бытовая техника", short_name : "Bytovaya-tehnika" },
    { category: "Компьютеры", short_name : "Computery" },
    { category: "Смартфоны", short_name : "Smartphony" },

  ];


  await categoryRepository.save(categories);

  console.log("Сиды добавлены успешно!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Ошибка при выполнении сидов:", err);
  process.exit(1);
});