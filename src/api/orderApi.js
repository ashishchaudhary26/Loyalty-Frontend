// src/api/orderApi.js
import api from "./axiosConfig";

// All endpoints based on your docs
// Base: http://localhost:8080

const orderApi = {
  // Create order from cart items + shipping address
  createOrder: (payload) =>
    api.post("/api/v1/orders", payload),

  // List current user's orders
  listOrders: () =>
    api.get("/api/v1/orders"),

  // Get details by order number
  getOrderDetail: (orderNumber) =>
    api.get(`/api/v1/orders/${orderNumber}`),

  // Fake payment init
  initiatePayment: (payload) =>
    api.post("/api/v1/payments/initiate", payload),

  // Fake payment verify
  verifyPayment: (payload) =>
    api.post("/api/v1/payments/verify", payload),
};

export default orderApi;
