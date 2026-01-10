import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { StockItem } from '../inventory/entities/stock-item.entity';

@Injectable()
export class ReportsService {
  constructor(private dataSource: DataSource) {}

  async getSalesSummary() {
    const result = await this.dataSource
      .getRepository(Sale)
      .createQueryBuilder('sale')
      .select('SUM(sale.total_amount)', 'totalRevenue')
      .where('sale.created_at >= CURRENT_DATE')
      .getRawOne();

    return {
      date: new Date().toISOString().split('T')[0],
      dailyRevenue: parseFloat(result.totalRevenue) || 0,
    };
  }

  async getInventoryStatus() {
    // This finds items where stock is less than 10 (Low Stock)
    const lowStock = await this.dataSource
      .getRepository(StockItem)
      .createQueryBuilder('stock')
      .where('stock.quantity_available < :threshold', { threshold: 10 })
      .getMany();

    return {
      lowStockItems: lowStock,
      totalAlerts: lowStock.length,
    };
  }
}