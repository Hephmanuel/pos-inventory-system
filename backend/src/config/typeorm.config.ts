import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL, 
  autoLoadEntities: true,
  synchronize: true, 
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});