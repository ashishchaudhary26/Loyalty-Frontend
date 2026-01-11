// src/api/authApi.js
import api from "./axiosConfig";

export const authApi = {
  
  register: (data) => api.post("/api/v1/auth/register", data),
  login: (data) => api.post("/api/v1/auth/login", data),

  // NOTE: Backend does NOT have /api/v1/auth/logout right now.
  // logout: () => api.post("/api/v1/auth/logout"),

  profile: () => api.get("/api/v1/auth/profile"),

  updateProfile: (data) => api.put("/api/v1/auth/profile", data),

  changePassword: (data) =>
    api.put("/api/v1/auth/profile/password", data), // { oldPassword, newPassword }
};
