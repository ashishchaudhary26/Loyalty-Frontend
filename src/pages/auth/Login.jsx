// src/pages/auth/Login.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: backendError } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const newErrors = {};

    if (!values.email) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      newErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...credentials, [name]: value };
    setCredentials(next);

    // live validation per field
    const fieldErrors = validate(next);
    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(login(credentials));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login to Continue</h2>
      

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={credentials.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="auth-field-error">{errors.email}</p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="auth-field-error">{errors.password}</p>
          )}
        </div>

        {backendError && <p className="auth-error">{backendError}</p>}

        <button
          type="submit"
          className="auth-btn-primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-footer-text">
        Don’t have an account?{" "}
        <Link to="/register" className="auth-link">
          Sign up
        </Link>
      </p>
    </div>
  );
}
