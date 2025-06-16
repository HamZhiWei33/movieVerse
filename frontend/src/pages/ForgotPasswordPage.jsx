import "../styles/general/general.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/general/FormField";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPasswordPage = () => {
  const { requestResetCode, verifyResetCode } = useAuthStore();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request code, 2 = verify code, 3 = reset password
  const [message, setMessage] = useState({ text: '', type: '' });
  const [timeLeft, setTimeLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const navigate = useNavigate();

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
      setMessage({ text: 'Reset code sent to your email', type: 'success' });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to send reset code',
        type: 'error'
      });
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
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', { email, code, newPassword });
      setMessage({ text: 'Password reset successfully', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to reset password',
        type: 'error'
      });
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
            <button className="submitButton" onClick={handlePasswordReset}>Verify</button>
          </form>
          <p>
            Return to <a href="/login">Login</a>
          </p>
        </div>
      )}
      {/* <h1>Forgot Password</h1>

      <form>
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Send Reset Link</button>
      </form> */}
    </main>
  );
};
export default ForgotPasswordPage;
