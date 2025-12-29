import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { StaffModule } from './modules/staff/staff.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SalesModule } from './modules/sales/sales.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }), 

    TypeOrmModule.forRoot(typeOrmConfig()), 
    AuthModule,
    StaffModule,
    CatalogModule,
    InventoryModule,
    SalesModule,
    ReportsModule,
  ],
})
export class AppModule {}
