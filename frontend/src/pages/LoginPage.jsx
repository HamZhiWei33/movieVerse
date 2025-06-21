import "../styles/general/general.css";
import "../styles/general/genre-selection.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const { login, isLoggingIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password });

      toast.success(`Welcome back, ${user.name}!`);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      console.warn("Login failed", err.message);
    }
  };

  return (
    <main className="login-page">
      <div className="form-group" align="center">
        <h1>Login</h1>
        <form className="form" onSubmit={handleSubmit}>
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
          <a id="forgotPwLink" href="/forgot_password">
            Forgot Password?
          </a>
          <button className="submitButton" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </main>
  );
};
export default LoginPage;
