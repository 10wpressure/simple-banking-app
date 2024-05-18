import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config';

export const AppDataSource = new DataSource(dataSourceOptions);
