import "../styles/general/general.css";
import "../styles/general/genre-selection.css";
import React, { useState, useContext } from "react";
import FormField from "../components/general/FormField";
import { UserValidationContext } from "../context/UserValidationProvider ";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserValidationContext);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake authentication logic
    if (email === "u1@gmail.com" && password === "u1") {
      login(); // update context
      localStorage.setItem("profileImg", "/profile/my_avatar.png"); // optional
      navigate("/");
    } else {
      alert("Invalid credentials");
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
          <button className="submitButton" type="submit">
            Login
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
