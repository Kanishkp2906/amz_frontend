// src/api.js
import axios from 'axios';

// 1. Setup the Base Connection
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});
// 2. Define the Actions (These match your Python Routes)

// GET /products
export const fetchProducts = async () => {
  try {
    console.log("Fetching products...");
    const response = await api.get('/tracking_products');
    console.log("Fetch response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

// POST /track_product
export const trackProduct = async (url) => {
  try {
    const response = await api.post('/track_product', { url: url.trim() });
    return response.data;
  } catch (error) {
    console.error("Failed to track product:", error);
    throw error;
  }
};

// DELETE /delete_tracking
export const deleteProduct = async (productId) => {
  try {
    console.log("Deleting product with ID:", productId);
    const response = await api.delete(`/delete_tracking/${productId}`);
    console.log("Delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    console.error("Delete error response:", error.response?.data);
    console.error("Delete error status:", error.response?.status);
    throw error;
  }
};

// PUT /submit_email
export const submitEmail = async (email) => {
  try {
    const response = await api.put('/submit_email', { email: email });
    return response.data;
  } catch (error) {
    console.error("Failed to submit email:", error);
    throw error;
  }
};

export default api;