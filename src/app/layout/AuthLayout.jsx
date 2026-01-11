import { Outlet } from "react-router-dom";
import "../layout/layout.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-box">
        <Outlet />
      </div>
    </div>
  );
}
