// src/store/slices/products/productsAPI.js
import api from "../../../api/axiosConfig";

// Normal paged list
export const fetchProducts = async (params = {}) => {
  const res = await api.get("/api/v1/products", { params });
  console.log(res)
  return res.data;
};

// Search products (paged)
export const searchProducts = async (params = {}) => {
  const res = await api.get("/api/v1/products/search", { params });
  return res.data;
};

// Single product details
export const fetchProductById = async (id) => {
  const res = await api.get(`/api/v1/products/${id}`);
  return res.data;
};
