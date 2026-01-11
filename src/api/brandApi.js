// src/api/brandApi.js
import api from "./axiosConfig";

export const brandApi = {
  getBrands: () => api.get("/api/v1/products/brands"),
};
