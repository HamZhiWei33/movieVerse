import "../styles/general/general.css";
import "../styles/general/genre-selection.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="login-page">
      <div className="form-group" align="center">
        <h1>Login</h1>
        <form className="form">
          <FormField type="email" name="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
          <FormField type="password" name="password" label="Password" onChange={(e) => setPassword(e.target.value)} />
          <a id="forgotPwLink" href="/forgot_password">Forgot Password?</a>
          <button className="submitButton" type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </main>
  );
};
export default LoginPage;
