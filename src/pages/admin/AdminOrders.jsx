// src/pages/admin/AdminOrders.jsx
import React, { useState } from "react";
import "./Admin.css";
import api from "../../api/axiosConfig";
import { adminApi } from "../../api/adminApi";

const AdminOrders = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/api/v1/orders/${orderNumber}`);
      setOrder(res.data);
      setStatus(res.data.orderStatus || "");
    } catch (err) {
      console.error("Failed to load order", err);
      const backend =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      setError(`Failed to load order: ${backend}`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !status.trim()) return;

    try {
      setUpdating(true);
      setError(null);

      const res = await adminApi.updateOrderStatus(orderNumber, status);
      // you get OrderStatusChangeResponse here
      console.log("Status updated:", res.data);

      // refresh order
      const refreshed = await api.get(`/api/v1/orders/${orderNumber}`);
      setOrder(refreshed.data);
      setStatus(refreshed.data.orderStatus || "");
    } catch (err) {
      console.error("Failed to update status", err);
      const backend =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      setError(`Failed to update status: ${backend}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Orders</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="admin-section">
        <h3>Find Order</h3>
        <form className="admin-form" onSubmit={handleFetchOrder}>
          <div className="form-row">
            <label>Order Number</label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ORD-2025-0001"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Load Order"}
          </button>
        </form>
      </div>

      {order && (
        <div className="admin-section">
          <h3>Order Details</h3>
          <p>
            <strong>Order Number:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Status:</strong> {order.orderStatus}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.totalAmount}
          </p>

          {/* Status update form */}
          <form className="admin-form" onSubmit={handleUpdateStatus}>
            <div className="form-row">
              <label>New Status</label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="PLACED / SHIPPED / DELIVERED / CANCELLED"
              />
            </div>
            <button type="submit" disabled={updating}>
              {updating ? "Updating..." : "Update Status"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
