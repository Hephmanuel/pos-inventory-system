import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement, MovementType } from './entities/stock-movement.entity';
import { Sku } from '../catalog/entities/sku.entity'; 

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StockItem)
    private stockItemRepo: Repository<StockItem>,
    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  // 1. DEDUCT STOCK
  async deductStock(sku_id: string, quantity: number, manager: any) {
    const item = await manager.findOne(StockItem, { where: { sku_id } });

    if (!item) throw new NotFoundException(`SKU ${sku_id} not found in inventory.`);

    const available = Number(item.quantity_available);
    if (available < quantity) {
      throw new BadRequestException(`Insufficient stock for SKU ${sku_id}.`);
    }

    item.quantity_available = available - quantity;
    await manager.save(item);

    const movement = manager.create(StockMovement, {
      sku_id,
      quantity: -quantity,
      reason: 'Sale Transaction',
      movement_type: MovementType.SALE,
    });
    await manager.save(movement);

    // Cast to any to safely access price if needed
    const sku = await manager.findOne(Sku, { where: { id: sku_id } });
    return { price: Number((sku as any).price || 0) };
  }

  // 2. GET STOCK LEVELS (Fixed for TS Errors)
  async getStockLevels() {
    // Get ALL SKUs for ACTIVE products only.
    const skus = await this.dataSource.getRepository(Sku).find({
      relations: ['product', 'stock_item'], 
      where: {
        product: {
          active: true,
        }
      },
      order: {
        product: { name: 'ASC' },
      },
    });

    return skus.map(sku => {
      const s = sku as any; 
      const quantity = s.stock_item ? Number(s.stock_item.quantity_available) : 0;
      const reorderPoint = s.reorder_point || 10;
      const skuCode = s.code || s.sku_code || 'UNKNOWN';

      return {
        sku_code: skuCode,
        product_name: s.product.name,
        quantity_available: quantity,
        reorder_point: reorderPoint,
        status: quantity === 0 
          ? 'OUT_OF_STOCK' 
          : quantity <= reorderPoint 
            ? 'LOW_STOCK' 
            : 'IN_STOCK'
      };
    });
  }

  // 3. UPDATE STOCK
  async updateStock(sku_id: string, quantity: number) {
    const item = await this.stockItemRepo.findOne({ where: { sku_id } });

    if (!item) {
        throw new NotFoundException('Stock item not found. Please initialize stock first.');
    }

    item.quantity_available = Number(item.quantity_available) + quantity;
    return await this.stockItemRepo.save(item);
  }
}