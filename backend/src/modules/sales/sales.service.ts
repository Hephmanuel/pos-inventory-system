import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleLine } from './entities/sale-line.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';
import { StockMovement, MovementType } from '../inventory/entities/stock-movement.entity';

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
      // 1. Create the initial Sale record
      const sale = queryRunner.manager.create(Sale, {
        employee_id: dto.employee_id,
        total_amount: 0,
      });
      
      const savedSale = await queryRunner.manager.save(sale);

      let runningTotal = 0;
      const receiptLines: any[] = []; // To store data for the rich response

      // 2. Process each item
      for (const item of dto.items) {
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

        const subtotal = skuData.price * item.quantity;
        runningTotal += subtotal;
        
        await queryRunner.manager.save(line);

        // Keep track of line details for the final receipt response
        receiptLines.push({
          sku_id: item.sku_id,
          quantity: item.quantity,
          unit_price: skuData.price,
          subtotal: subtotal
        });
      }

      // 3. Update the Sale with the final total and the formatted Receipt ID
      // Assuming 'receipt_index' is an auto-incrementing column in your DB
      savedSale.total_amount = runningTotal;
      
      // Generate the human-readable ID (e.g., RCT-001)
      // Note: savedSale.receipt_index is populated by the DB after the first save
      const formattedId = `RCT-${savedSale.receipt_index.toString().padStart(3, '0')}`;
      savedSale.receipt_id = formattedId;

      await queryRunner.manager.save(savedSale);

      await queryRunner.commitTransaction();

      // 4. Return the "Option 1" Rich Response (Everything the frontend needs)
      return {
        message: 'Checkout Successful',
        receipt: {
          receipt_no: savedSale.receipt_id,
          transaction_id: savedSale.id,
          date: savedSale.created_at,
          employee_id: savedSale.employee_id,
          items: receiptLines,
          total_amount: savedSale.total_amount,
          status: 'PAID'
        }
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Checkout Failed: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
  const sales = await this.dataSource.getRepository(Sale).find({
    select: {
      id: true,
      receipt_id: true,
      total_amount: true,
      employee_id: true,
      created_at: true,
    },
    relations: ['lines'],
    order: { created_at: 'DESC' },
  });

  // Map to match the 'receipt_no' naming used in other endpoints
  return sales.map(sale => ({
    ...sale,
    receipt_no: sale.receipt_id
  }));
}

  // Kept this for re-printing or history purposes
  async getReceipt(id: string) {
    const sale = await this.dataSource.getRepository(Sale).findOne({
      where: { id },
      relations: ['lines'], 
    });
    
    if (!sale) throw new NotFoundException('Receipt not found');

    // Return it in a similar "Receipt" format for consistency
    return {
      receipt_no: sale.receipt_id,
      date: sale.created_at,
      items: sale.lines,
      total_amount: sale.total_amount
    };
  }

  async refundSale(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the sale with its line items
      const sale = await queryRunner.manager.findOne(Sale, {
        where: { id },
        relations: ['lines'],
      });

      if (!sale) throw new NotFoundException('Sale record not found');

      // 2. Loop through lines to restore stock
      for (const line of sale.lines) {
        // Increment the quantity available in stock_items
        await this.inventoryService.updateStock(line.sku_id, Number(line.quantity));

        // 3. Log the 'RETURN' movement for the Audit Trail
        const movement = queryRunner.manager.create(StockMovement, {
          sku_id: line.sku_id,
          quantity: Number(line.quantity),
          reason: `Refund processed for Receipt: ${sale.receipt_id}`,
          movement_type: MovementType.RETURN,
        });
        await queryRunner.manager.save(movement);
      }

      // 4. Update the sale status (Optional: add a 'status' column to Sale entity later)
      // For now, we will leave the sale record but the inventory is restored.

      await queryRunner.commitTransaction();
      return { 
        message: 'Refund successful', 
        receipt_no: sale.receipt_id,
        restored_items: sale.lines.length 
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Refund Failed: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

}