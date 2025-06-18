import "./App.css";
import { Routes, Route, useLocation, Navigate, useLoaderData } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import GenreSelectionPage from "./pages/GenreSelectionPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import DirectoryPage from "./pages/DirectoryPage";
import RankingPage from "./pages/RankingPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import MovieDetailPage from "./pages/MovieDetailPage";
import NewReleasedPage from "./pages/NewReleasedPage";
import { useEffect, useContext, useState } from "react";
import {
  UserValidationProvider,
  UserValidationContext,
} from "../src/context/UserValidationProvider "; // Fixed space and added provider import
import FooterGuest from "./components/FooterGuest";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { FaSpinner } from 'react-icons/fa';
import { AppRoutes } from './AppRoutes';

const ProtectedRoute = ({ children, intendedPath, meta = {} }) => {
  const { authUser, isCheckingAuth, isAuthChecked, favouriteGenres } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth || !isAuthChecked) return;

  console.log(location.pathname);
  console.log("AuthUser in navigating:", authUser);

  // Public-only route but user is authenticated
  if (meta.publicOnly && authUser) {
    return <Navigate to={`/`} replace />;
  }

  // No genre check for public, but genre check for validated
  if (location.pathname === "/") {
    console.log(authUser);
    console.log("Meta:", meta);
  }
  if (meta.public && !authUser) {
    return children;
  }

  // Protected route but not authenticated
  if (meta.protected && !authUser) {
    return <Navigate to={`/login`} replace />;
    // navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
    //   replace: true,
    // });
    // return;
  }



  // Requires genres but doesn't have enough
  if (
    (meta.requiresGenres &&
      (!authUser?.favouriteGenres || authUser.favouriteGenres.length < 3) &&
      !meta.skipGenreCheck)
  ) {
    return <Navigate to={`/genre_selection?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;

  // // Still loading auth state
  // if (isCheckingAuth || !isAuthChecked) {
  //   return <FaSpinner className="icon-spin" />;
  // }

  // // Not authenticated - redirect to login with return URL
  // if (!authUser) {
  //   console.log("Not login!");
  //   if (intendedPath === "/") {
  //     return children;
  //   }
  //   return <Navigate to={`/login`} replace />;
  // }

  // console.log("Logged In!");

  // // Authenticated but missing genres - redirect to genre selection
  // if ((authUser.favouriteGenres?.length ?? 0) < 3 && !intendedPath.startsWith('/genre_selection')) {
  //   return <Navigate to={`/genre_selection?redirect=${encodeURIComponent(intendedPath)}`} replace />;
  // }

  // // All checks passed - render the requested content
  // return children;
};

// Define FooterSelector first since it's used in App
function FooterSelector() {
  const { isValidateUser } = useContext(UserValidationContext);
  return isValidateUser ? <Footer /> : <FooterGuest />;
}

function AppContent() {
  const { isValidatedUser } = useContext(UserValidationContext);
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  // const [favouriteGenres, setFavouriteGenres] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // const loadAuthUser = async() => {
    //   await checkAuth();

    // }
    const check = async () => {
      try {
        const res = await checkAuth();
        console.log("Checking Auth: ", res);
      } catch (error) {
        throw error;
      }

    }
    check();

  }, []);

  return (
    <>
      <ScrollToTopOnNavigate />
      <Navbar />
      <Routes>
        {AppRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.meta?.protected || route.meta?.publicOnly ? (
                <ProtectedRoute meta={route.meta}>
                  {route.element}
                </ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route
          path="/"
          element={
            <ProtectedRoute intendedPath={location.pathname}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/genre_selection" element={<GenreSelectionPage />} />
        <Route path="/forgot_password" element={<ForgotPasswordPage />} />
        <Route path="/reset_password" element={<ResetPasswordPage />} />
        <Route path="/change_password" element={<ChangePasswordPage />} /> */}
        {/* <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/movie/:movieId" element={<MovieDetailPage />} />
        <Route path="/new-released" element={<NewReleasedPage />} /> */}
        {/* <Route
          path="/directory"
          element={
            <ProtectedRoute intendedPath={location.pathname}>
              <DirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ranking"
          element={
            <ProtectedRoute intendedPath={location.pathname}>
              <RankingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute intendedPath={location.pathname}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:movieId"
          element={
            <ProtectedRoute intendedPath={location.pathname}>
              <MovieDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-released"
          element={
            <ProtectedRoute intendedPath={location.pathname}>
              <NewReleasedPage />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
      <Toaster />
      {/* <FooterSelector /> */}
      {isCheckingAuth ? null : authUser ? <Footer /> : <FooterGuest />}
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
