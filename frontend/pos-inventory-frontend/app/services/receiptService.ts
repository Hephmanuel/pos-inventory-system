// app/services/receiptService.ts
import api from '../lib/api';

/**
 * Fetches the real sales history from the Render backend.
 * The backend already renames 'receipt_id' to 'receipt_no' for us.
 */
export const getSalesHistory = async () => {
  const response = await api.get('/sales');
  return response.data; // Returns the array of sales objects
};