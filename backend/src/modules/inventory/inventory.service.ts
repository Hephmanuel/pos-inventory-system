import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StockItem) private stockRepo: Repository<StockItem>,
    @InjectRepository(StockMovement) private movementRepo: Repository<StockMovement>,
  ) {}

  async deductStock(skuId: string, quantity: number, manager: any) {
  // This is a temporary placeholder for Dev 3
  // In a real scenario, it checks the DB and throws error if qty < quantity
  return { price: 2500.00 }; // Returns a fake price so the sale can calculate total
}
}
