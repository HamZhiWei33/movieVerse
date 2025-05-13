import "../styles/general/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake authentication logic
    if (
      name === "u1" &&
      email === "u1@gmail.com" &&
      password === "u1" &&
      password === confirmPassword
    ) {
      navigate("/genre_selection");
    } else {
      alert("Invalid credentials");
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
            onChange={(e) => setName(e.target.value)}
          />
          <FormField
            type="email"
            name="email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            type="password"
            name="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormField
            type="password"
            name="confirm_password"
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="submitButton" type="submit">
            Sign Up
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
