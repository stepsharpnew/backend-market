import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config'

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: "postgres-image",
    //host : 'localhost',
    port: 5432,
    username: "postgres",
    password: "12345678",
    database: "postgres",
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}']
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;