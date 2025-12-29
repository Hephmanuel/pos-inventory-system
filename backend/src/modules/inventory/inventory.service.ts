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


}
