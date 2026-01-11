import api from "./axiosConfig";

export const cartApi = {
  getCart: (cartUuid) =>
    api.get("/api/v1/cart", {
      params: cartUuid ? { cart_uuid: cartUuid } : {},
    }),

  addItem: (data) => api.post("/api/v1/cart/items", data),

  updateItem: (id, data) => api.put(`/api/v1/cart/items/${id}`, data),

  removeItem: (id) => api.delete(`/api/v1/cart/items/${id}`),

  clearCart: (cartUuid) =>
    api.delete("/api/v1/cart", {
      params: cartUuid ? { cart_uuid: cartUuid } : {},
    }),
};


export default cartApi;
