// src/pages/auth/Register.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: backendError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const newErrors = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (values.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!values.email) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!values.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^[0-9]{10}$/.test(values.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
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
    const next = { ...form, [name]: value };
    setForm(next);

    const fieldErrors = validate(next);
    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(register(form));

    if (result.meta.requestStatus === "fulfilled") {
      alert("Registration successful! Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
     

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="reg-fullName">Full Name</label>
          <input
            id="reg-fullName"
            type="text"
            name="fullName"
            placeholder="Your full name"
            value={form.fullName}
            onChange={handleChange}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && (
            <p className="auth-field-error">{errors.fullName}</p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="auth-field-error">{errors.email}</p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="reg-mobile">Mobile Number</label>
          <input
            id="reg-mobile"
            type="text"
            name="mobileNumber"
            placeholder="10-digit mobile"
            value={form.mobileNumber}
            onChange={handleChange}
            aria-invalid={!!errors.mobileNumber}
          />
          {errors.mobileNumber && (
            <p className="auth-field-error">{errors.mobileNumber}</p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Login
        </Link>
      </p>
    </div>
  );
}
