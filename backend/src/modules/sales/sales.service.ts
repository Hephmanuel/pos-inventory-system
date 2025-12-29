import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleLine } from './entities/sale-line.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class SalesService {
  constructor(
    private dataSource: DataSource,
    private inventoryService: InventoryService, 
  ) {}

  async checkout(dto: CreateSaleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = queryRunner.manager.create(Sale, {
        employee_id: dto.employee_id,
        total_amount: 0,
      });
      const savedSale = await queryRunner.manager.save(sale);

      let runningTotal = 0;

      for (const item of dto.items) {
        // Calls Inventory module to deduct stock and get current SKU price
        const skuData = await this.inventoryService.deductStock(
            item.sku_id, 
            item.quantity, 
            queryRunner.manager
        );

        const line = queryRunner.manager.create(SaleLine, {
          sale: savedSale,
          sku_id: item.sku_id,
          quantity: item.quantity,
          unit_price: skuData.price, 
        });

        runningTotal += skuData.price * item.quantity;
        await queryRunner.manager.save(line);
      }

      savedSale.total_amount = runningTotal;
      await queryRunner.manager.save(savedSale);

      await queryRunner.commitTransaction();
      return this.getReceipt(savedSale.id); 
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Checkout Failed: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getReceipt(id: string) {
    const sale = await this.dataSource.getRepository(Sale).findOne({
      where: { id },
      relations: ['lines'], 
    });
    if (!sale) throw new NotFoundException('Receipt not found');
    return sale;
  }
}