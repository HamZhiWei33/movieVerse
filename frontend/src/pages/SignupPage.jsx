import "../styles/general.css";
const SignupPage = () => {
  return (
    <main className="signup-page">
      <h1>Signup Page</h1>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            equired
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirm_password">Confirmed Password:</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
};
export default SignupPage;
