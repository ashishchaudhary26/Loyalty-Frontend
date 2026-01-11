// src/pages/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadProfile,
  updateProfile,
} from "../../redux/slices/auth/authSlice";
import { changePasswordAPI } from "../../redux/slices/auth/authAPI";

import "./Profile.css";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Profile form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
  });

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Messages
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Inline validation errors
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Toggle for inline password form
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Load profile on mount
  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  // Hydrate form when user changes
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || user.phone || "",
      });
    }
  }, [user]);

  // --- Validation helpers ---

  const validateProfile = (values) => {
    const errs = {};

    if (!values.fullName.trim()) {
      errs.fullName = "Full name is required.";
    } else if (values.fullName.trim().length < 3) {
      errs.fullName = "Full name must be at least 3 characters.";
    }

    if (values.mobileNumber) {
      if (!/^[0-9]{10}$/.test(values.mobileNumber)) {
        errs.mobileNumber = "Enter a valid 10-digit mobile number.";
      }
    }

    return errs;
  };

  const validatePasswordForm = (values) => {
    const errs = {};

    if (!values.oldPassword) {
      errs.oldPassword = "Old password is required.";
    }

    if (!values.newPassword) {
      errs.newPassword = "New password is required.";
    } else if (values.newPassword.length < 6) {
      errs.newPassword = "Password must be at least 6 characters.";
    }

    return errs;
  };

  // --- Handlers ---

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setProfileMessage("");
    setProfileErrors(validateProfile(next));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const next = { ...passwordForm, [name]: value };
    setPasswordForm(next);
    setPasswordMessage("");
    setPasswordErrors(validatePasswordForm(next));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage("");

    const errs = validateProfile(form);
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const result = await dispatch(
        updateProfile({
          fullName: form.fullName,
          mobileNumber: form.mobileNumber,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setProfileMessage("Profile updated successfully ✅");
      } else {
        setProfileMessage("Failed to update profile ❌");
      }
    } catch (err) {
      console.error(err);
      setProfileMessage("Error updating profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    const errs = validatePasswordForm(passwordForm);
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await changePasswordAPI({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage("Password changed successfully ✅");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setPasswordMessage("Old password incorrect ❌");
      } else {
        setPasswordMessage("Failed to change password");
      }
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-page-shell">
        <p className="profile-loading">Loading profile...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-page-shell">
        <p className="profile-error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page-shell">
      <div className="profile-header">
        <h2 className="profile-title">Account Settings</h2>

      </div>

      <div className="profile-card">
        {/* PERSONAL INFO */}
        <form
          className="profile-section"
          onSubmit={handleProfileSubmit}
          noValidate
        >
          <h3 className="profile-section-title">Personal details</h3>

          <div className="profile-field-row">
            <div className="profile-field">
              <label htmlFor="pf-fullName">Full Name</label>
              <input
                id="pf-fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleProfileChange}
                aria-invalid={!!profileErrors.fullName}
              />
              {profileErrors.fullName && (
                <p className="profile-field-error">{profileErrors.fullName}</p>
              )}
            </div>
          </div>

          <div className="profile-field-row">
            <div className="profile-field">
              <label htmlFor="pf-email">Email</label>
              <input
                id="pf-email"
                name="email"
                type="email"
                value={form.email}
                disabled
              />
              <p className="profile-field-help">
                Email cannot be changed at the moment.
              </p>
            </div>

            <div className="profile-field">
              <label htmlFor="pf-mobile">Mobile Number</label>
              <input
                id="pf-mobile"
                name="mobileNumber"
                type="text"
                value={form.mobileNumber}
                onChange={handleProfileChange}
                aria-invalid={!!profileErrors.mobileNumber}
              />
              {profileErrors.mobileNumber && (
                <p className="profile-field-error">
                  {profileErrors.mobileNumber}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="profile-btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>

          {profileMessage && (
            <p
              className={
                profileMessage.includes("✅")
                  ? "profile-message profile-message-success"
                  : "profile-message profile-message-error"
              }
            >
              {profileMessage}
            </p>
          )}
        </form>

        {/* SECURITY SECTION */}

        <div className="profile-section profile-security">
          <div className="profile-security-row">
            <h3 className="profile-section-title">Change password</h3>

            <button
              type="button"
              className="profile-link-btn"
              onClick={() => setShowPasswordSection((prev) => !prev)}
            >
              {showPasswordSection ? "Hide" : "Edit"}
            </button>
          </div>

          {showPasswordSection && (
            <form
              className="profile-password-form"
              onSubmit={handlePasswordSubmit}
              noValidate
            >
              <div className="profile-field">
                <label htmlFor="pf-oldPassword">Old Password</label>
                <input
                  id="pf-oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  aria-invalid={!!passwordErrors.oldPassword}
                />
                {passwordErrors.oldPassword && (
                  <p className="profile-field-error">
                    {passwordErrors.oldPassword}
                  </p>
                )}
              </div>

              <div className="profile-field">
                <label htmlFor="pf-newPassword">New Password</label>
                <input
                  id="pf-newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  aria-invalid={!!passwordErrors.newPassword}
                />
                {passwordErrors.newPassword && (
                  <p className="profile-field-error">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <button type="submit" className="profile-btn-primary">
                Update Password
              </button>

              {passwordMessage && (
                <p
                  className={
                    passwordMessage.includes("✅")
                      ? "profile-message profile-message-success"
                      : "profile-message profile-message-error"
                  }
                >
                  {passwordMessage}
                </p>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
