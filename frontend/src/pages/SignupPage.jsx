import "../styles/general/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  return (
    <main className="signup-page">
      <div className="form-group" align="center">
        <h1>Sign Up</h1>
        <form className="form">
          <FormField type="text" name="name" label="Your Name" onChange={(e) => setName(e.target.value)} />
          <FormField type="email" name="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
          <FormField type="password" name="password" label="Password" onChange={(e) => setPassword(e.target.value)} />
          <FormField type="password" name="confirm_password" label="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
          <button className="submitButton" type="submit">Sign Up</button>
        </form>
        <p>
          Already has an account? <a href="/login">Login</a>
        </p>
      </div>
    </main>
  );
};
export default SignupPage;
