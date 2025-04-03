import "../styles/navbar.css";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
const Navbar = () => {
  return (
    <header>
      <div id="navbar">
        <div className="logo">
          <Link to="/">
            <img src="Logo.svg" alt="logo" />
          </Link>
        </div>
        <nav className="nav-links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/directory">Directory</Link>
            </li>
            <li>
              <Link to="/ranking">Ranking</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
              <FaAngleDown />
            </li>
            <li>
              <Link to="/login">Logout</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
