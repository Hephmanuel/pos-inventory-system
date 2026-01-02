import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSkuDto {
  @IsString()
  sku_code: string;

  @IsNumber()
  price: number;

  @IsString()
  attribute: string; 
}

export class CreateProductDto {
  // REMOVED: id, created_at, updated_at (Database handles these!)

  @IsString()
  name: string;

  @IsString()
  @IsOptional() // Use this if description is not mandatory
  description: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean; // The '?' makes it optional

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkuDto) // validtes the objects inside the array
  skus: CreateSkuDto[];
}