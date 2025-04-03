import { Link } from "react-router-dom";
import "../styles/footer.css";
const Footer = () => {
  return (
    <footer id="footer">
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
        </li>
      </ul>
      <div>
        <p>
          Disclaimer: This website provides webpage services only and does not
          host, produce, or store any video content. All videos are embedded
          from third-party sources, and we do not take responsibility for their
          availability or copyright compliance. If you have any legal concerns,
          please contact the appropriate content providers.
        </p>
        <p>&copy; MovieVerse | Powered by TMDB API</p>
        <a href="mailto:movieverse@gmail.com">movieverse@gmail.com</a>
      </div>
    </footer>
  );
};
export default Footer;
