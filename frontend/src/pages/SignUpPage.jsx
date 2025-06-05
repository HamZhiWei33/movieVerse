import "../styles/general/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignupPage = () => {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

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
      toast.error(
        "Username can only contain letters, numbers, and underscores"
      );
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

    // Real-time validation
    if (name === "password" && value.length > 0 && value.length < 8) {
      setErrors({ ...errors, password: "Password too short" });
    } else if (
      name === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      setErrors({ ...errors, email: "Invalid email format" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Fake authentication logic
  //   if (
  //     name === "u1" &&
  //     email === "u1@gmail.com" &&
  //     password === "u1" &&
  //     password === confirmPassword
  //   ) {
  //     navigate("/genre_selection");
  //   } else {
  //     alert("Invalid credentials");
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const success = validateForm();
  //   if (success === true) {
  //     signup(formData);
  //     navigate("/genre_selection");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Starting signup..."); // Debug 1
    console.log("Form Data:", formData);

    if (!validateForm()) {
      console.log("Validation failed"); // Debug 2
      return;
    }

    try {
      console.log("Calling signup API..."); // Debug 3
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        // confirm_password: formData.confirm_password,
      });
      console.log("Signup result:", result); // Debug 4

      console.log("Navigating to /genre_selection"); // Debug 5
      navigate("/genre_selection");
    } catch (error) {
      console.error("SIGNUP ERROR:", error); // Debug 6
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
            error={errors.name}
          />
          <FormField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <FormField
            type="password"
            name="confirm_password"
            label="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
          />
          <button className="submitButton" type="submit" disabled={isSigningUp}>
            {isSigningUp ? <>Loading...</> : "Sign Up"}
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
