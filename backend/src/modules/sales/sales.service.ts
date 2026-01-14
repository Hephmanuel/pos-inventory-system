import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleLine } from './entities/sale-line.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';
// We no longer need StockMovement here if adjustStock handles it
import { MovementType } from '../inventory/entities/stock-movement.entity';

@Injectable()
export class SalesService {
  constructor(
    private dataSource: DataSource,
    private inventoryService: InventoryService,
  ) {}

  /**
   * PROCESS CHECKOUT
   */
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
      const receiptLines: any[] = [];

      for (const item of dto.items) {
        // deductStock uses the transaction manager for safety
        const skuData = await this.inventoryService.deductStock(
          item.sku_id,
          item.quantity,
          queryRunner.manager,
        );

        const line = queryRunner.manager.create(SaleLine, {
          sale: savedSale,
          sku_id: item.sku_id,
          quantity: item.quantity,
          unit_price: skuData.price,
        });

        const subtotal = skuData.price * item.quantity;
        runningTotal += subtotal;

        await queryRunner.manager.save(line);

        receiptLines.push({
          sku_id: item.sku_id,
          quantity: item.quantity,
          unit_price: skuData.price,
          subtotal: subtotal,
        });
      }

      savedSale.total_amount = runningTotal;
      const formattedId = `RCT-${savedSale.receipt_index.toString().padStart(3, '0')}`;
      savedSale.receipt_id = formattedId;

      await queryRunner.manager.save(savedSale);
      await queryRunner.commitTransaction();

      return {
        message: 'Checkout Successful',
        receipt: {
          receipt_no: savedSale.receipt_id,
          transaction_id: savedSale.id,
          date: savedSale.created_at,
          employee_id: savedSale.employee_id,
          items: receiptLines,
          total_amount: savedSale.total_amount,
          status: 'PAID',
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Checkout Failed: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * PROCESS REFUND
   */
  async refundSale(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await queryRunner.manager.findOne(Sale, {
        where: { id },
        relations: ['lines'],
      });

      if (!sale) throw new NotFoundException('Sale record not found');

      if (sale.status === 'REFUNDED') {
        throw new BadRequestException(
          'This transaction has already been refunded.',
        );
      }

      // 🔄 Loop through lines to restore stock
      for (const line of sale.lines) {
        // Updated to use adjustStock with the required DTO format
        // Pass the arguments individually to match the new InventoryService signature
        await this.inventoryService.adjustStock(
          line.sku_id,
          Number(line.quantity),
          `Refund processed for Receipt: ${sale.receipt_id}`, // <--- Passing the reason!
        );
      }

      sale.status = 'REFUNDED';
      await queryRunner.manager.save(sale);

      await queryRunner.commitTransaction();
      return {
        message: 'Refund successful',
        receipt_no: sale.receipt_id,
        restored_items: sale.lines.length,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Refund Failed: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * GET ALL SALES
   */
  async findAll() {
    const sales = await this.dataSource.getRepository(Sale).find({
      select: {
        id: true,
        receipt_id: true,
        total_amount: true,
        employee_id: true,
        created_at: true,
        status: true,
      },
      relations: ['lines'],
      order: { created_at: 'DESC' },
    });

    return sales.map((sale) => ({
      ...sale,
      receipt_no: sale.receipt_id,
    }));
  }

  /**
   * GET SINGLE RECEIPT
   */
  async getReceipt(id: string) {
    const sale = await this.dataSource.getRepository(Sale).findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!sale) throw new NotFoundException('Receipt not found');

    return {
      receipt_no: sale.receipt_id,
      date: sale.created_at,
      items: sale.lines,
      total_amount: sale.total_amount,
      status: sale.status,
    };
  }
}
