import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const user = useSelector((state) => state.user.user);

  const isAdmin = user?.role === "ADMIN";
  const isBusiness = user?.role === "BUSINESS";
  const isCustomer = user?.role === "CUSTOMER";

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        
        <div className="sidebar-header">
          <h2>Loyalty+</h2>
          <button className="close-btn" onClick={toggleSidebar}>✖</button>
        </div>

        <nav className="sidebar-links">

          <Link 
            to="/dashboard" 
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            🏠 Dashboard
          </Link>

          {isCustomer && (
            <>
              <Link to="/rewards" className={location.pathname === "/rewards" ? "active" : ""}>
                🎁 My Rewards
              </Link>
              <Link to="/scanner" className={location.pathname === "/scanner" ? "active" : ""}>
                📷 Scan QR
              </Link>
              <Link to="/history" className={location.pathname === "/history" ? "active" : ""}>
                📜 Transaction History
              </Link>
              <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                👤 Profile
              </Link>
            </>
          )}

          {isBusiness && (
            <>
              <Link to="/business/qr" className={location.pathname === "/business/qr" ? "active" : ""}>
                🔳 Generate QR
              </Link>
              <Link to="/business/customers" className={location.pathname === "/business/customers" ? "active" : ""}>
                👥 Customers
              </Link>
              <Link to="/history" className={location.pathname === "/history" ? "active" : ""}>
                📦 Reward Logs
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/products" className={location.pathname === "/admin/products" ? "active" : ""}>
                📦 Manage Products
              </Link>

              <Link to="/admin/orders" className={location.pathname === "/admin/orders" ? "active" : ""}>
                📜 Orders
              </Link>

              <Link to="/admin/users" className={location.pathname === "/admin/users" ? "active" : ""}>
                👥 Users Management
              </Link>
            </>
          )}

        </nav>
      </aside>

      {open && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
