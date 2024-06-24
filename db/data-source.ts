import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '172.20.160.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'dat_san_bong_da_db',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};
export const dataSource = new DataSource(dataSourceOptions);
