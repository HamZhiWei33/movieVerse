import "../styles/general.css";
const ForgotPasswordPage = () => {
  return (
    <main className="forgot-password-page">
      <h1>Forgot Password</h1>
      <p>Please enter your email address to reset your password.</p>
      <form>
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Send Reset Link</button>
      </form>
    </main>
  );
};
export default ForgotPasswordPage;
