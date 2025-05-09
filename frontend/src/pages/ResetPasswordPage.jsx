import "../styles/general/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <main className="reset-password-page">
      <div className="form-group" align="center">
        <h1>Reset Password</h1>
        <form className="form">
          <FormField type="password" name="password" label="New Password" onChange={(e) => setPassword(e.target.value)} />
          <FormField type="password" name="confirm_password" label="Confirm New Password" onChange={(e) => setConfirmPassword(e.target.value)} />
          <button className="submitButton" type="submit">Confirm</button>
        </form>
        <p>
          Return to <a href="/login">Login</a>
        </p>
      </div>
    </main>
  );
};
export default ResetPasswordPage;
