// backend/src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => {
  const dbUrl = process.env.DATABASE_URL;
  // If we are connecting to Aiven (production), use SSL. If localhost, don't.
  const useSsl = dbUrl?.includes('aivencloud.com');

  return {
    type: 'postgres',
    url: dbUrl, 
    autoLoadEntities: true,
    synchronize: true, 
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    extra: useSsl ? { ssl: { rejectUnauthorized: false } } : {},
  };
};