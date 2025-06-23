import "../styles/general/general.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/general/FormField";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestResetCode, verifyResetCode, resetPassword } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request code, 2 = verify code, 3 = reset password
  const [timeLeft, setTimeLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  
  useEffect(() => {
    if (!expiresAt || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const sendRequestCode = async (e) => {
    e.preventDefault();
    try {
      const responseData = await requestResetCode(email);
      setExpiresAt(new Date(responseData.expiresAt));
      setTimeLeft(Math.floor((new Date(responseData.expiresAt) - new Date()) / 1000));
      setStep(2);
    } catch (error) {
      console.log(error.response?.data?.message || 'Failed to send reset code');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyResetCode(email, code);
      if (response) {
        setStep(3);
        console.log("Verified");
      }
    } catch (error) {
      console.log("Verification failed");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await resetPassword(email, code, newPassword, confirmPassword);
      
      if (response) {
        navigate('/login');
      }

    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to reset password');
      console.error(error);
    }
  };

  return (
    <main className="forgot-password-page">
      {step === 1 && (
        <div className="form-group" align="center">
          <div>
            <h1>Forgot Password</h1>
            <p style={{ color: "#BFBFBF" }}>Please enter your email address</p>
          </div>
          <form className="form">
            <FormField type="email" name="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
            <button className="submitButton" onClick={sendRequestCode}>Send Code</button>
          </form>
          <p>
            Return to <a href="/login">Login</a>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="form-group" align="center">
          <div>
            <h1>Verify Code</h1>
            <p style={{ color: "#BFBFBF" }}>Enter the code sent to your email</p>
          </div>
          <form className="form">
            <FormField type="text" name="code" label="Verification Code" onChange={(e) => setCode(e.target.value)} />
            <button className="submitButton" onClick={handleVerify}>Verify</button>
          </form>
          <p>
            Return to <a href="/login">Login</a>
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="form-group" align="center">
          <div>
            <h1>Reset Password</h1>
            <p style={{ color: "#BFBFBF" }}>Enter your new password</p>
          </div>
          <form className="form">
            <FormField type="password" name="password" label="New Password" onChange={(e) => setNewPassword(e.target.value)} />
            <FormField type="password" name="confirm_password" label="Confirm New Password" onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="submitButton" onClick={handlePasswordReset}>Reset</button>
          </form>
          <p>
            Return to <a href="/login">Login</a>
          </p>
        </div>
      )}
    </main>
  );
};
export default ForgotPasswordPage;
