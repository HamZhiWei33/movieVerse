import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

const Navbar = () => {
  return (
    <header>
      <div id="navbar">
        <div className="logo">
          <NavLink to="/">
            <img src="Logo.svg" alt="logo" />
          </NavLink>
        </div>
        <nav className="nav-links">
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
            <li>
              <NavLink to="/profile">Profile</NavLink>
              <FaAngleDown />
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
