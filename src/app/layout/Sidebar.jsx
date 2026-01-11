import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div className={`sidebar-overlay ${isOpen ? "active" : ""}`} onClick={closeSidebar}></div>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={closeSidebar}>
            ✕
          </button>
        </div>

        <ul className="sidebar-links">
          <li><Link to="/" onClick={closeSidebar}>Home</Link></li>
          <li><Link to="/products" onClick={closeSidebar}>All Products</Link></li>
          <li><Link to="/categories" onClick={closeSidebar}>Categories</Link></li>
          <li><Link to="/cart" onClick={closeSidebar}>My Cart</Link></li>
          <li><Link to="/orders" onClick={closeSidebar}>My Orders</Link></li>
          <li><Link to="/profile" onClick={closeSidebar}>Profile</Link></li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
