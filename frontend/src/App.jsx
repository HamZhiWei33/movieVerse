import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FooterGuest from "./components/FooterGuest";

import { UserValidationProvider, UserValidationContext } from "../src/context/UserValidationProvider ";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { AppRoutes } from "./AppRoutes";

const ProtectedRoute = ({ children, meta = {} }) => {
  const { authUser, isCheckingAuth, isAuthChecked } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth || !isAuthChecked) return;

  // Public-only route but user is authenticated
  if (meta.publicOnly && authUser) {
    return <Navigate to={`/`} replace />;
  }

  // No genre check for public, but genre check for validated
  if (meta.public && !authUser) {
    return children;
  }

  // Protected route but not authenticated
  if (meta.protected && !authUser) {
    return <Navigate to={`/login`} replace />;
  }

  // Requires genres but doesn't have enough
  if (
    meta.requiresGenres &&
    (!authUser?.favouriteGenres || authUser.favouriteGenres.length < 3) &&
    !meta.skipGenreCheck
  ) {
    return (
      <Navigate to={`/genre_selection?redirect=${encodeURIComponent(location.pathname)}`} replace/>
    );
  }

  return children;
};

function AppContent() {
  const { isValidatedUser } = useContext(UserValidationContext);
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
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
                <ProtectedRoute meta={route.meta}>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
      <Toaster />
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
