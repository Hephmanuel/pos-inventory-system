import { baseURL } from './constant';

/**
 * GET /inventory/stock-levels
 * Returns stock quantity per SKU
 */
export async function getStockLevels() {
  const res = await fetch(`${baseURL}/inventory/stock-levels`);

  if (!res.ok) {
    throw new Error('Failed to fetch stock levels');
  }

  const stockLevels = await res.json();

  /**
   * Convert array → map
   * {
   *   [sku_id]: quantity_available
   * }
   */
  const stockMap: Record<string, number> = {};

  stockLevels.forEach((item: any) => {
    stockMap[item.sku_id] = Number(item.quantity_available);
  });

  return stockMap;
}
