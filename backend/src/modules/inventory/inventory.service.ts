import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement, MovementType } from './entities/stock-movement.entity';
import { Sku } from '../catalog/entities/sku.entity';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StockItem)
    private stockItemRepo: Repository<StockItem>,
    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  /**
   * 1. DEDUCT STOCK
   * Used during checkout transactions
   */
  async deductStock(sku_id: string, quantity: number, manager: any) {
    const item = await manager.findOne(StockItem, { where: { sku_id } });

    if (!item)
      throw new NotFoundException(`SKU ${sku_id} not found in inventory.`);

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

    const sku = await manager.findOne(Sku, { where: { id: sku_id } });
    return { price: Number(sku.base_price || 0) };
  }

  /**
   * 2. GET STOCK LEVELS
   * Fetches current inventory for the frontend dashboard
   */
  async getStockLevels() {
    const skus = await this.dataSource.getRepository(Sku).find({
      relations: ['product', 'stock_item'],
      where: {
        product: {
          active: true,
        },
      },
      order: {
        product: { name: 'ASC' },
      },
    });

    return skus.map((sku) => {
      const quantity = sku.stock_item
        ? Number(sku.stock_item.quantity_available)
        : 0;
      const reorderPoint = 10;

      return {
        sku_id: sku.id,
        sku_code: sku.sku_code || 'UNKNOWN',
        product_name: sku.product.name,
        quantity_available: quantity,
        reorder_point: reorderPoint,
        status:
          quantity === 0
            ? 'OUT_OF_STOCK'
            : quantity <= reorderPoint
              ? 'LOW_STOCK'
              : 'IN_STOCK',
      };
    });
  }

  /**
   * 3. ADJUST STOCK
   * Handled by the InventoryController /api/v1/inventory/adjust
   */
  async adjustStock(data: any, amount?: number, reason?: string) {
    // 1. Destructure the values based on how it's called
    const sku_id = typeof data === 'string' ? data : data.sku_id;
    const qty = typeof data === 'string' ? amount : data.quantity;
    const res =
      typeof data === 'string' ? reason : data.reason || 'Manual Adjustment';

    // 2. Now use the extracted 'sku_id' for the query
    let stock = await this.stockItemRepo.findOne({ where: { sku_id } });

    if (!stock) {
      stock = this.stockItemRepo.create({
        sku_id: sku_id,
        store_id: 'MAIN_STORE',
        quantity_available: 0,
      });
      await this.stockItemRepo.save(stock);
    }

    // 3. Update using the extracted 'qty'
    const currentQuantity = Number(stock.quantity_available || 0);
    stock.quantity_available = currentQuantity + Number(qty);

    const savedItem = await this.stockItemRepo.save(stock);

    // 4. Log movement with the extracted 'res'
    const movement = this.movementRepo.create({
      sku_id,
      quantity: Number(qty),
      reason: res,
      movement_type: MovementType.ADJUSTMENT,
    });
    await this.movementRepo.save(movement);

    return savedItem;
  }
}
