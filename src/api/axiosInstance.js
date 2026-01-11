import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // gateway URL
});

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  HANDLE JWT EXPIRY
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("JWT expired → triggering logout popup");

      localStorage.clear();

      // THIS IS WHAT WAS MISSING
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;
