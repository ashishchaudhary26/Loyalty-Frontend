import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-page">
      <div className="content-container">
        <h2 className="title">Admin Dashboard</h2>
        <p className="subtitle">Manage your products and orders efficiently.</p>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/products")}
          >
            Products
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/admin/orders")}
          >
            Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
