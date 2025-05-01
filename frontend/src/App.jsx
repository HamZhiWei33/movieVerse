import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DirectoryPage from "./pages/DirectoryPage";
import RankingPage from "./pages/RankingPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import MovieDetailPage from "./pages/MovieDetailPage";
import NewReleasedPage from "./pages/NewReleasedPage";
import { useEffect, useContext } from "react";
import {
  UserValidationProvider,
  UserValidationContext,
} from "../src/context/UserValidationProvider "; // Fixed space and added provider import
import FooterGuest from "./components/FooterGuest";

// Define FooterSelector first since it's used in App
function FooterSelector() {
  const { isValidateUser } = useContext(UserValidationContext);
  return isValidateUser ? <Footer /> : <FooterGuest />;
}

function AppContent() {
  const { isValidatedUser } = useContext(UserValidationContext);
  return (
    <>
      <ScrollToTopOnNavigate />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot_password" element={<ForgotPasswordPage />} />
        <Route path="/reset_password" element={<ResetPasswordPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/movie/:movieTitle" element={<MovieDetailPage />} />
        <Route path="/new-released" element={<NewReleasedPage />} />
      </Routes>
      <FooterSelector />
    </>
  );
}
function App() {
  return (
    <UserValidationProvider>
      <AppContent />
    </UserValidationProvider>
  );
}
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;
