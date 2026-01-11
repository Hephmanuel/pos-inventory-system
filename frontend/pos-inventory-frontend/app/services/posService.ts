// @ts-nocheck
import api from '../lib/api';

/**
 * Process a Checkout
 * Aligned with Joshua's Postman Doc
 */
export const processCheckout = async (checkoutData) => {
  // Try /sales first. If it still 404s, verify with Joshua if the route is /sales/checkout
  const response = await api.post('/sales/checkout', checkoutData);
  return response.data;
};