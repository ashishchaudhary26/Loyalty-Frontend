// src/api/categoryApi.js
import api from "./axiosConfig";

export const categoryApi = {
  getCategories: () => api.get("/api/v1/products/categories"),
};
