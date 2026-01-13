// @ts-nocheck
import axios from 'axios';

/**
 * BASE API CONFIGURATION
 * This instance is used by every service in the app.
 * It ensures we don't have to type the URL every time.
 */
const api = axios.create({
  baseURL: 'https://pos-inventory-system-r7w8.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;