// src/components/Navbar/Navbar.jsx
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/slices/auth/authSlice";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.totalItems || 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeAllMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeAllMenus();
    navigate("/");
  };

  const displayName = user?.fullName || user?.email || "User";
  const firstLetter = displayName?.charAt(0)?.toUpperCase();
  const isAdmin = user?.role === "ADMIN";

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <>
      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="nav-overlay" onClick={closeAllMenus} />}

      <nav className="navbar">
        <div className="nav-inner">
          {/* LOGO */}
          <div className="nav-left">
            <Link to="/" className="nav-logo" onClick={closeAllMenus}>
              Loyalty<span>+</span>
            </Link>
          </div>

          {/* CENTER LINKS */}
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link
              to="/"
              className={isActive("/") ? "nav-link active" : "nav-link"}
              onClick={closeAllMenus}
            >
              Home
            </Link>
      <Link
  to="/reward"
  className={isActive("/reward") ? "nav-link active" : "nav-link"}
  onClick={closeAllMenus}
>
  Rewards
</Link>


            <Link
              to="/categories"
              className={
                isActive("/categories") ? "nav-link active" : "nav-link"
              }
              onClick={closeAllMenus}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={isActive("/about") ? "nav-link active" : "nav-link"}
              onClick={closeAllMenus}
            >
              About
            </Link>
          </div>

          {/* RIGHT SIDE: CART + AUTH */}
          <div className="nav-right">
            {/* Cart */}
            <Link
              to="/cart"
              className="cart-icon"
              aria-label="Cart"
              onClick={closeAllMenus}
            >
              <span className="cart-emoji">🛒</span>
              {cartCount > 0 && (
                <span className="badge" aria-label={`${cartCount} items in cart`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!user ? (
              <Link to="/login" className="login-btn" onClick={closeAllMenus}>
                Login
              </Link>
            ) : (
              <div className="user-menu">
                <button
                  type="button"
                  className="user-avatar"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-haspopup="true"
                >
                  {firstLetter}
                </button>

                <div
                  className={`dropdown-menu ${
                    dropdownOpen ? "open" : ""
                  }`}
                >
                  <p className="dropdown-user">{displayName}</p>

                  <Link
                    to="/profile"
                    onClick={closeAllMenus}
                    className="dropdown-link"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeAllMenus}
                    className="dropdown-link"
                  >
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeAllMenus}
                      className="dropdown-link admin-link"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    className="logout-btn"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="hamburger"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
