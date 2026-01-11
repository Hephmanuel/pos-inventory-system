// @ts-nocheck
import api from '../lib/api';

/**
 * AUTH SERVICE
 * This module handles all communication related to staff and authentication.
 */

/**
 * 1. Register a new Staff Member
 * Maps to: POST /staff
 * Expects: first_name, last_name, email, pin_code, role
 */
export const registerStaff = async (staffData) => {
  const response = await api.post('/staff', staffData);
  return response.data;
};

/**
 * 2. Login to the Terminal
 * Maps to: POST /auth/login
 * Expects: email, pin_code
 */
export const loginUser = async (email, pin_code) => {
  // We send an object matching the LoginDto
  const response = await api.post('/auth/login', { email, pin_code });
  return response.data; // Returns { message, user: { id, full_name, role } }
};