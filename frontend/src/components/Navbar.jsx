import "../styles/navbar.css";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import useIsMobile from "../store/useIsMobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const guestRoutes = [
    "/login",
    "/signup",
    "/forgot_password",
    "/reset_password",
    "/genre_selection",
  ];
  const isGuest = guestRoutes.includes(location.pathname);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header role="banner">
      <div id="navbar">
        <div className="logo" aria-label="Go to homepage">
          <NavLink to="/">
            <img src="logo.gif" alt="App logo" width={300} height={50} />
          </NavLink>
        </div>
        <button
          id="menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="navigation-menu"
        >
          <MenuIcon />
        </button>
        {/* Overlay to close sidebar */}
        {menuOpen && (
          <div
            className="navbar-overlay"
            onClick={toggleMenu}
            aria-label="Close navigation menu overlay"
            aria-hidden="true"
          ></div>
        )}
        <div className="search-bar" role="search" aria-label="Site search">
          <input
            id="searchInput"
            type="text"
            placeholder="Search"
            aria-label="Search input"
          />
          <SearchIcon size={20} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <nav
            className={`nav-links ${menuOpen ? "open" : ""}`}
            role="navigation"
            aria-label="Main navigation"
          >
            {isGuest ? (
              <ul>
                <li>
                  <NavLink to="/login" end aria-label="Login page">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup" end aria-label="Sign up page">
                    Sign Up
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <NavLink to="/" end aria-label="Homepage">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/directory" aria-label="Movie directory page">
                    Directory
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/ranking" aria-label="Movie ranking page">
                    Ranking
                  </NavLink>
                </li>
                <li style={{ display: "flex", flexDirection: "row" }}>
                  <NavLink to="/profile" aria-label="Profile page">
                    Profile
                    <FaAngleDown style={{ alignSelf: "center" }} />
                  </NavLink>
                </li>
                {isMobile && (
                  <li>
                    <NavLink to="/login" aria-label="Logout">
                      Logout
                    </NavLink>
                  </li>
                )}
              </ul>
            )}
          </nav>

          {!isMobile && !isGuest && (
            <NavLink to="/login" aria-label="Logout">
              <div
                className="logout-btn"
                role="button"
                aria-label="Logout button with profile image"
              >
                <div>
                  <div className="profile-container">
                    <img
                      src={
                        localStorage.getItem("profileImg") ||
                        "/profile/placeholder_avatar.svg"
                      }
                      alt="User profile avatar"
                      height={50}
                      aria-label="User profile image"
                    />
                  </div>
                  <p>Logout</p>
                </div>
              </div>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
