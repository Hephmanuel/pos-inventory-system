import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement, MovementType } from './entities/stock-movement.entity';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StockItem) private stockItemRepo: Repository<StockItem>,
    @InjectRepository(StockItem) private stockRepo: Repository<StockItem>,
    @InjectRepository(StockMovement) private movementRepo: Repository<StockMovement>,
  ) {}

  async deductStock(skuId: string, quantity: number, manager: any) {
  // This is a temporary placeholder for Dev 3
  // In a real scenario, it checks the DB and throws error if qty < quantity
  return { price: 2500.00 }; // Returns a fake price so the sale can calculate total
}

  async getStockLevels() {
    return await this.stockItemRepo.find();
  }

  // 2. Task: Manually add or remove stock + Log it
  async adjustStock(dto: AdjustStockDto) {
    const { sku_id, quantity, reason } = dto;

    // Try to find the item
    let item = await this.stockItemRepo.findOne({ where: { sku_id } });

    if (!item) {
      // If it's a new item, we create it. 
      // Note: Joshua's entity requires 'store_id', so I'll add a placeholder
      item = this.stockItemRepo.create({ 
        sku_id, 
        store_id: 'MAIN_STORE', 
        quantity_available: 0,
        quantity_reserved: 0 
      });
    }

    // Use 'quantity_available' instead of 'quantity'
    item.quantity_available = Number(item.quantity_available) + quantity;
    await this.stockItemRepo.save(item);

    // CREATE THE AUDIT TRAIL
    const movement = this.movementRepo.create({
      sku_id,
      quantity: quantity, // In Movement entity, it is called 'quantity'
      reason,
      movement_type: MovementType.ADJUSTMENT, // Using the Enum you defined
    });
    await this.movementRepo.save(movement);

    return { 
      message: 'Stock adjusted successfully', 
      newItemBalance: item.quantity_available 
    };
  }

  // 3. Joshua's Internal Method
  async updateStock(sku_id: string, qty: number) {
    const item = await this.stockItemRepo.findOne({ where: { sku_id } });
    if (!item) throw new NotFoundException('SKU not found');
    
    item.quantity_available = Number(item.quantity_available) + qty;
    return await this.stockItemRepo.save(item);
  }
}
