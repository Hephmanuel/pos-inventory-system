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


  async deductStock(sku_id: string, quantity: number, manager: any) {
    //Find the item using the manager
    const item = await manager.findOne(StockItem, { where: { sku_id } });

    if (!item) {
      throw new NotFoundException(`Item with SKU ${sku_id} not found in inventory.`);
    }

    //Check if we have enough stock (Convert to Number because decimals return as strings)
    const available = Number(item.quantity_available);
    if (available < quantity) {
      throw new Error(`Insufficient stock for ${sku_id}. Available: ${available}, Requested: ${quantity}`);
    }

    //Deduct the stock
    item.quantity_available = available - quantity;
    await manager.save(item);

    //Log the movement (Audit Trail)
    const movement = manager.create(StockMovement, {
      sku_id,
      quantity: -quantity, // Negative because it's leaving the inventory
      reason: 'Sale Transaction',
      movement_type: MovementType.SALE,
    });
    await manager.save(movement);

    //Return a fake price as requested
    return { price: 2500.00 }; 
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
