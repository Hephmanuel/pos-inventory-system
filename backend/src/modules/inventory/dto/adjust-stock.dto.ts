import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AdjustStockDto {
  @IsString()
  @IsNotEmpty()
  sku_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number; 

  @IsString()
  @IsNotEmpty()
  reason: string; 
}