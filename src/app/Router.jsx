// src/router/Router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "./layout/MainLayout";

// Pages
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Products from "../pages/products/Products";
import ProductDetail from "../pages/products/ProductDetail";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import Profile from "../pages/profile/Profile";
import Orders from "../pages/orders/Orders";

// Admin Panel
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";

// Categories page
import CategoriesPage from "../pages/categories/CategoriesPage";

export default function Router() {
  return (
    <Routes>
      {/* All public + protected pages that share navbar/footer */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<Products />} />
        {/* param name matches ProductDetail: useParams().productId */}
        <Route path="/products/:productId" element={<ProductDetail />} />
        {/* categories */}
        <Route path="/categories" element={<CategoriesPage />} />

        {/* Protected customer pages */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth pages (no MainLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
