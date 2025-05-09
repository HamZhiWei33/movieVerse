import "../styles/navbar.css";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Optional: ensure state is correct on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div id="navbar">
        <div className="logo">
          <NavLink to="/">
            <img src="logo.gif" alt="logo" width={300} height={50} />
          </NavLink>
        </div>
        <button id="menu-button" onClick={toggleMenu}>
          <MenuIcon />
        </button>

        <div className="search-bar">
          <input id="searchInput" type="text" placeholder="Search" />
          <SearchIcon size={20} />
        </div>

        <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap: "1rem"}}>
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <NavLink to="/" end>Home</NavLink>
              </li>
              <li>
                <NavLink to="/directory">Directory</NavLink>
              </li>
              <li>
                <NavLink to="/ranking">Ranking</NavLink>
              </li>
              <li style={{ display: "flex", flexDirection: "row" }}>
                <NavLink to="/profile">
                  Profile
                  <FaAngleDown style={{ alignSelf: "center" }} />
                </NavLink>
              </li>
              {isMobile &&
                <li>
                  <NavLink to="/login">Logout</NavLink>
                </li>}
            </ul>
          </nav>

          {!isMobile &&
            <NavLink to="/login">
              <button className="logout-btn">
                <div>
                  <div className="profile-container">
                    <img
                      src={localStorage.getItem("profileImg") || "/profile/placeholder_avatar.svg"}
                      alt="profile picture"
                      height={50}
                      aria-describedby="image-instruction" />
                  </div>
                  <p>Logout</p>
                </div>
              </button>
            </NavLink>}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
