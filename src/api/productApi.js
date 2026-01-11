// src/api/productApi.js
import axiosClient from "./axiosConfig";

// 🔹 List products (paged)
export const getProducts = (params) =>
  axiosClient.get("/api/v1/products", { params });

// 🔹 Search products (paged)
export const searchProducts = (params) =>
  axiosClient.get("/api/v1/products/search", { params });

// 🔹 Get single product details
export const getProductById = (id) =>
  axiosClient.get(`/api/v1/products/${id}`);

// 🔹 Get product reviews
export const getProductReviews = (id) =>
  axiosClient.get(`/api/v1/products/${id}/reviews`);

// 🔹 Add product review  ✅ UPDATED
// src/api/productApi.js
export const postReview = (id, { rating, comment, userId }) => {
  console.log("🚀 FRONTEND REVIEW REQUEST >>>", {
    endpoint: `/api/v1/products/${id}/reviews`,
    rating,
    reviewTitle: "Review",
    reviewText: comment,
    userId,
  });

  return axiosClient.post(
    `/api/v1/products/${id}/reviews`,
    {
      rating,
      reviewTitle: "Review",
      reviewText: comment,
    },
    {
      headers: {
        "X-USER-ID": userId,
      },
    }
  );
};


// 🔹 Get all categories
export const getCategories = () =>
  axiosClient.get("/api/v1/products/categories");

// 🔹 Get all brands
export const getBrands = () =>
  axiosClient.get("/api/v1/products/brands");
