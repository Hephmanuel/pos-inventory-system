import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-summary')
  getSalesSummary() {
    return this.reportsService.getSalesSummary();
  }

  @Get('inventory-status')
  getInventoryStatus() {
    return this.reportsService.getInventoryStatus();
  }
}