import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockItem, StockMovement])],
  controllers: [], 
  providers: [],   
  exports: [TypeOrmModule],
})
export class InventoryModule {}