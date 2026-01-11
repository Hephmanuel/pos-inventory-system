// @ts-nocheck
import { Injectable, BadRequestException } from '@nestjs/common'; 
import { DataSource } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { SaleLine } from '../sales/entities/sale-line.entity';
import { Sku } from '../catalog/entities/sku.entity';

@Injectable()
export class ReportsService {
  constructor(private dataSource: DataSource) {}

  /**
   * Helper: Safely parses a date string or defaults to "Today"
   * Prevents 'Invalid Date' database crashes
   */
  private getSafeDateRange(dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    
    if (isNaN(date.getTime())) {
       throw new BadRequestException(`Invalid date format: ${dateStr}`);
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // 1. Top Selling Products
  async getTopSellingProducts(limit = 5, startDate?: string, endDate?: string) {
    const query = this.dataSource.getRepository(SaleLine)
      .createQueryBuilder('line')
      .select('line.sku_id', 'sku_id')
      .addSelect('SUM(line.quantity)', 'total_quantity_sold')
      .addSelect('SUM(line.quantity * line.unit_price)', 'total_revenue')
      .groupBy('line.sku_id')
      .orderBy('total_quantity_sold', 'DESC')
      .limit(limit);

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        query.where('line.created_at BETWEEN :start AND :end', { start: s, end: e });
      }
    }

    const items = await query.getRawMany();

    return Promise.all(items.map(async (item) => {
      const sku = await this.dataSource.getRepository(Sku).findOne({
        where: { id: item.sku_id },
        relations: ['product']
      });
      return {
        ...item,
        product_name: sku?.product?.name || 'Unknown Product',
        total_quantity_sold: Number(item.total_quantity_sold),
        total_revenue: Number(item.total_revenue)
      };
    }));
  }

  // 2. Daily Summary (Fixed to handle missing date parameter)
  async getDailySummary(dateStr?: string) {
    const { start, end } = this.getSafeDateRange(dateStr);

    const result = await this.dataSource.getRepository(Sale)
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.lines', 'line')
      .where('sale.created_at BETWEEN :start AND :end', { start, end })
      .getMany();

    const total_revenue = result.reduce((acc, sale) => acc + Number(sale.total_amount), 0);
    const total_items_sold = result.reduce((acc, sale) => 
      acc + sale.lines.reduce((lAcc, line) => lAcc + Number(line.quantity), 0), 0);

    return {
      date: start.toISOString().split('T')[0],
      total_revenue,
      dailyRevenue: total_revenue, // Matches dashboard
      totalSales: result.length,    // Matches dashboard
      total_items_sold,
      total_transactions: result.length
    };
  }

  // 3. Sales Over Time
  async getSalesOverTime(startDate: string, endDate: string) {
    const s = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); 
    const e = endDate ? new Date(endDate) : new Date();

    const data = await this.dataSource.getRepository(Sale)
      .createQueryBuilder('sale')
      .select("DATE(sale.created_at)", "date")
      .addSelect("SUM(sale.total_amount)", "revenue")
      .where("sale.created_at BETWEEN :start AND :end", { start: s, end: e })
      .groupBy("DATE(sale.created_at)")
      .orderBy("date", "ASC")
      .getRawMany();

    return {
      range: { start_date: s, end_date: e },
      data: data.map(d => ({ date: d.date, revenue: Number(d.revenue) }))
    };
  }
}