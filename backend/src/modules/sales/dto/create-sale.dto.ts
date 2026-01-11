import { IsArray, IsString, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SaleItemDto {
  @ApiProperty({ example: 'b98606bf-0e39-4666-a007-cc4b51b1f5a3', description: 'The UUID of the SKU' }) // 🆕
  @IsString()
  @IsNotEmpty()
  sku_id: string;

  @ApiProperty({ example: 2, description: 'Quantity being purchased' }) // 🆕
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @ApiProperty({ example: '4c6452e6-1c6f-4599-822b-7b3fccb533b1', description: 'UUID of the staff member' }) // 🆕
  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty({ type: [SaleItemDto], description: 'List of items in the sale' }) // 🆕
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}