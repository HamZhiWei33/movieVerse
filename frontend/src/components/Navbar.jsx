import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  return (
    <header>
      <div id="navbar">
        <div className="logo">
          <NavLink to="/">
            <img src="logo.gif" alt="logo" width={300} height={50} />
          </NavLink>
        </div>
        <button id="menu-button">
          <MenuIcon />
        </button>
        <div className="search-bar">
          <input id="searchInput" type="text" placeholder="Search" />
          <SearchIcon size={20} />
        </div>

        <nav className="nav-links">
          <ul>
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/directory">Directory</NavLink>
            </li>
            <li>
              <NavLink to="/ranking">Ranking</NavLink>
            </li>
            <li style={{ display: "flex", flexDirection: "row" }}>
              <NavLink to="/profile">Profile</NavLink>
              <FaAngleDown style={{ alignSelf: "center" }} />
            </li>
            <li>
              <NavLink to="/login">Logout</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
