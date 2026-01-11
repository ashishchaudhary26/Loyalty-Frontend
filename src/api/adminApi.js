// src/api/adminApi.js
import api from "./axiosConfig";

export const adminApi = {
  // PRODUCT CRUD (admin)
  getProducts: (params) => api.get("/api/v1/products", { params }), // returns Page<ProductDto>

  getProductById: (id) => api.get(`/api/v1/products/${id}`), // returns ProductDetailDto

  createProduct: (data) => api.post("/api/v1/products/admin", data),

  updateProduct: (id, data) => api.put(`/api/v1/products/admin/${id}`, data),

  deleteProduct: (id) => api.delete(`/api/v1/products/admin/${id}`),

  // IMAGE METADATA (admin)
  uploadImage: (productId, data) =>
    api.post(`/api/v1/products/admin/${productId}/images`, data),

  deleteImage: (productId, imageId) =>
    api.delete(`/api/v1/products/admin/${productId}/images/${imageId}`),

  // STOCK (admin)
  updateStock: (id, data) =>
    api.put(`/api/v1/products/admin/${id}/stock`, data),

  // ORDER STATUS UPDATE (admin)
  updateOrderStatus: (orderNo, status) =>
    api.put(`/admin/api/v1/orders/${orderNo}/status`, null, {
      params: { status },
    }),
    createCategory: (data) =>
    api.post("/api/v1/products/admin/categories", data),

  createBrand: (data) =>
    api.post("/api/v1/products/admin/brands", data)
};
