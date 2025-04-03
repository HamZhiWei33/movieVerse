import "../styles/general.css";
const ResetPasswordPage = () => {
  return (
    <main className="reset-password-page">
      <h1>Reset Password</h1>
      <form>
        <label htmlFor="new_password">
          New Password:
          <input
            type="password"
            id="new_password"
            name="new_password"
            placeholder="Password"
            required
          />
        </label>
        <label htmlFor="confirmed_new_password">
          Confirmed New Password:
          <input
            type="password"
            id="confirmed_new_password"
            name="confirmed_new_password"
            placeholder="Password"
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </main>
  );
};
export default ResetPasswordPage;
