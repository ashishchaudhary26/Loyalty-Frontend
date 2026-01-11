// src/redux/slices/auth/authAPI.js
import axiosClient from "../../../api/axiosClient";

export const loginAPI = async (credentials) => {
  const res = await axiosClient.post("/api/v1/auth/login", credentials);
  return res.data;
};

export const registerAPI = async (payload) => {
  const res = await axiosClient.post("/api/v1/auth/register", payload);
  return res.data;
};

export const fetchProfileAPI = async () => {
  const res = await axiosClient.get("/api/v1/auth/profile");
  return res.data;
};

// 🔹 NEW: Update profile (fullName, mobileNumber)
export const updateProfileAPI = async (payload) => {
  // payload: { fullName, mobileNumber }
  const res = await axiosClient.put("/api/v1/auth/profile", payload);
  return res.data; // same shape as Get Profile
};

// 🔹 NEW: Change password
export const changePasswordAPI = async (payload) => {
  // payload: { oldPassword, newPassword }
  const res = await axiosClient.put(
    "/api/v1/auth/profile/password",
    payload
  );
  return res.data; // 204 No Content, but axios still returns an object
};
