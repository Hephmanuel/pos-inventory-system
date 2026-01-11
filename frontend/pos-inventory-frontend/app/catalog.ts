import { baseURL } from './constant';
import { getStockLevels } from './stock';

export async function getCatalogTableData() {
  // fetch both endpoints in parallel
  const [productsRes, stockMap] = await Promise.all([
    fetch(`${baseURL}/catalog/products`),
    getStockLevels(),
  ]);

  if (!productsRes.ok) {
    throw new Error('Failed to fetch catalog products');
  }

  const products = await productsRes.json();

  return products.flatMap((product: any) =>
    product.skus.map((sku: any) => ({
      skuId: sku.id,
      sku: sku.sku_code,
      product: product.name,
      category: product.description,
      stock: stockMap[sku.id] ?? 0, // ✅ REAL STOCK
      price: Number(sku.base_price),
    }))
  );
}
