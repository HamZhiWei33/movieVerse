import "../styles/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  return (
    <main className="forgot-password-page">
      <div className="form-group" align="center">
        <div>
          <h1>Reset Password</h1>
          <p style={{color:"#BFBFBF"}}>Please enter your email address</p>
        </div>
        <form className="form">
          <FormField type="email" name="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
          <button id="submitButton" type="submit">Reset Password</button>
        </form>
        <p>
          Return to <a href="/login">Login</a>
        </p>
      </div>
      {/* <h1>Forgot Password</h1>

      <form>
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Send Reset Link</button>
      </form> */}
    </main>
  );
};
export default ForgotPasswordPage;
