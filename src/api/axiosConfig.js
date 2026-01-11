// src/api/axiosConfig.js
import axios from "axios";

let storeRef;

export const injectStore = (_store) => {
  storeRef = _store;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Prefer Redux store token, fallback to localStorage
  const token =
    storeRef?.getState()?.auth?.token || localStorage.getItem("token");
    
console.log("axiosConfig called-----");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//old code
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("API Error:", err?.response?.data || err);
//     return Promise.reject(err);
//   }
// );

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err?.response?.status;
// console.log("✅ axiosConfig.js LOADED");

//     if (status === 401) {
//       console.warn("JWT expired or unauthorized → session expired");

//       // Clear auth data
//       localStorage.removeItem("token");

//       window.dispatchEvent(new Event("session-expired"));
//       window.alert("session expired");
//       window.location.href = "/login";
//     }

//     return Promise.reject(err);
//   }
// );
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;

/*
OLD axiosClient version (not used anymore):

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
*/
