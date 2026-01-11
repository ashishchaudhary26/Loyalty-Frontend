// src/api/addressApi.js
import api from "./axiosConfig";

export const getAddresses = () => api.get("/api/v1/shipping-addresses");

export const createAddress = (payload) =>
  api.post("/api/v1/shipping-addresses", payload);

export const deleteAddress = (id) =>
  api.delete(`/api/v1/shipping-addresses/${id}`);
