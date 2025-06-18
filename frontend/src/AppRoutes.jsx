import HomePage from './pages/HomePage';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import GenreSelectionPage from './pages/GenreSelectionPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DirectoryPage from './pages/DirectoryPage';
import RankingPage from './pages/RankingPage';
import ProfilePage from './pages/ProfilePage';
import MovieDetailPage from './pages/MovieDetailPage';
import NewReleasedPage from './pages/NewReleasedPage';

export const AppRoutes = [
  // Public routes
  {
    path: '/signup',
    element: <SignupPage />,
    meta: {
      title: 'Sign Up',
      publicOnly: true
    }
  },
  {
    path: '/login',
    element: <LoginPage />,
    meta: {
      title: 'Login',
      publicOnly: true
    }
  },
  {
    path: '/forgot_password',
    element: <ForgotPasswordPage />,
    meta: {
      title: 'Forgot Password'
    }
  },
  {
    path: '/reset_password',
    element: <ResetPasswordPage />,
    meta: {
      title: 'Reset Password'
    }
  },

  // Conditionally protected routes
  {
    path: '/',
    element: <HomePage />,
    meta: {
      title: 'Home',
      public: true,
      // protected: true,
      requiresGenres: true, // Homepage accessible without genres
      publicSkipGenreCheck: true
    }
  },
  {
    path: '/genre_selection',
    element: <GenreSelectionPage />,
    meta: {
      title: 'Select Genres',
      protected: true,
      skipGenreCheck: true // Bypass genre requirement for this route
    }
  },

  // Fully protected routes (require auth + 3+ genres)
  {
    path: '/directory',
    element: <DirectoryPage />,
    meta: {
      title: 'Directory',
      protected: true,
      requiresGenres: true
    }
  },
  {
    path: '/ranking',
    element: <RankingPage />,
    meta: {
      title: 'Rankings',
      protected: true,
      requiresGenres: true
    }
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    meta: {
      title: 'Profile',
      protected: true,
      requiresGenres: true
    }
  },
  {
    path: '/change_password',
    element: <ChangePasswordPage />,
    meta: {
      title: 'Change Password',
      protected: true,
      requiresGenres: true
    }
  },
  {
    path: '/movie/:movieId',
    element: <MovieDetailPage />,
    meta: {
      title: 'Movie Details',
      protected: true,
      requiresGenres: true
    }
  },
  {
    path: '/new-released',
    element: <NewReleasedPage />,
    meta: {
      title: 'New Releases',
      protected: true,
      requiresGenres: true
    }
  }
];