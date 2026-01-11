import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashboard/Sidebar";
import "../../app/layout/layout.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}
