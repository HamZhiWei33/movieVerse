import { Link } from "react-router-dom";
import "../styles/footer.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h4>Home</h4>
            <ul>
              <li><Link to="/watchlist">Watchlist</Link></li>
              <li><Link to="/ranking">Ranking</Link></li>
              <li><Link to="/directory/new">New Released</Link></li>
              <li><Link to="/recommendation">Recommendation</Link></li>
            </ul>
          </div>

          <div>
            <h4>Directory</h4>
            <ul>
              <li><Link to="/directory/genre">Genres</Link></li>
              <li><Link to="/directory/trending">Trending</Link></li>
              <li><Link to="/directory/new">New Release</Link></li>
              <li><Link to="/directory/popular">Popular</Link></li>
            </ul>
          </div>

          <div>
            <h4>Ranking</h4>
            <ul>
              <li><Link to="/ranking/genre">Genres</Link></li>
              <li><Link to="/ranking/trending">Trending</Link></li>
              <li><Link to="/ranking/new">New Release</Link></li>
              <li><Link to="/ranking/popular">Popular</Link></li>
            </ul>
          </div>

          <div>
            <h4>Profile</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Disclaimer: This website provides webpage services only and does not host, produce, or store any video content.
            All videos are embedded from third-party sources. We do not take responsibility for their availability or copyright compliance.
            If you have any legal concerns, please contact the appropriate content providers.
          </p>
          <p>&copy; MovieVerse | Powered by TMDB API</p>
          <p>Email: MovieVerse@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
