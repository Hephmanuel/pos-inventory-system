import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement, MovementType } from './entities/stock-movement.entity';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { Sku } from '../catalog/entities/sku.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StockItem) 
    private stockItemRepo: Repository<StockItem>, // Removed duplicate stockRepo injection
    @InjectRepository(StockMovement) 
    private movementRepo: Repository<StockMovement>,
  ) {}

  async deductStock(sku_id: string, quantity: number, manager: any) {
    const item = await manager.findOne(StockItem, { where: { sku_id } });
    if (!item) throw new NotFoundException(`Item with SKU ${sku_id} not found.`);

    const sku = await manager.findOne(Sku, { where: { id: sku_id } });
    if (!sku) throw new NotFoundException(`SKU details not found.`);

    const available = Number(item.quantity_available);
    if (available < quantity) throw new Error(`Insufficient stock.`);

    item.quantity_available = available - quantity;
    await manager.save(item);

    const movement = manager.create(StockMovement, {
      sku_id,
      quantity: -quantity, 
      reason: 'Sale Transaction',
      movement_type: MovementType.SALE,
    });
    await manager.save(movement);

    // Return the actual price from the database
    return { price: Number(sku.base_price) };
  }

  async getStockLevels() {
    return await this.stockItemRepo.find();
  }

  async adjustStock(dto: AdjustStockDto) {
    const { sku_id, quantity, reason } = dto;

    let item = await this.stockItemRepo.findOne({ where: { sku_id } });

    if (!item) {
      item = this.stockItemRepo.create({ 
        sku_id, 
        store_id: 'MAIN_STORE', 
        quantity_available: 0,
        quantity_reserved: 0 
      });
    }

    item.quantity_available = Number(item.quantity_available) + quantity;
    await this.stockItemRepo.save(item);

    const movement = this.movementRepo.create({
      sku_id,
      quantity: quantity, 
      reason,
      movement_type: MovementType.ADJUSTMENT,
    });
    await this.movementRepo.save(movement);

    return { 
      message: 'Stock adjusted successfully', 
      newItemBalance: item.quantity_available 
    };
  }

  async updateStock(sku_id: string, qty: number) {
    const item = await this.stockItemRepo.findOne({ where: { sku_id } });
    if (!item) throw new NotFoundException('SKU not found');
    
    item.quantity_available = Number(item.quantity_available) + qty;
    return await this.stockItemRepo.save(item);
  }
}