import "../styles/general/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (formData.name.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }
    if (/[^a-zA-Z0-9_]/.test(formData.name)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return false;
    }

    // Confirm password
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      console.error("SIGNUP ERROR:", error.response.data.message);
    }
  };

  return (
    <main className="signup-page">
      <div className="form-group" align="center">
        <h1>Sign Up</h1>
        <form className="form" onSubmit={handleSubmit}>
          <FormField
            type="text"
            name="name"
            label="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormField
            type="password"
            name="confirm_password"
            label="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <button className="submitButton" type="submit" disabled={isSigningUp}>
            {isSigningUp ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already has an account? <a href="/login">Login</a>
        </p>
      </div>
    </main>
  );
};
export default SignupPage;
