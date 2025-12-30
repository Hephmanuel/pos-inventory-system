export class CreateSkuDto {
  sku_code: string;
  price: number;
  attribute: string; // e.g. "Size: M"
}

export class CreateProductDto {
  name: string;
  description: string;
  skus: CreateSkuDto[];
}