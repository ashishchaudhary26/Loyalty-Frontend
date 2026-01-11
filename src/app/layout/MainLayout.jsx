// src/pages/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../layout/layout.css";

export default function MainLayout() {
  return (
    <div className="layout-container">
      <Navbar />

      <main className="layout-content">
        <div className="layout-content-inner">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
