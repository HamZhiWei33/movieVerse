import { Link } from "react-router-dom";
import "../styles/footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const FooterGuest = () => {
  return (
    <footer id="footer" role="contentinfo" aria-label="Guest footer">
      <div className="footer-container">
        <div className="footer-grid guest">
          <div>
            <nav aria-label="Login navigation">
              <ul>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <nav aria-label="Signup navigation">
              <ul>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <i className="fab fa-facebook-f"></i> */}
                <FaFacebook aria-hidden="true"/>
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <i className="fab fa-twitter"></i> */}
                <FaXTwitter aria-hidden="true"/>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <i className="fab fa-linkedin-in"></i> */}
                <FaLinkedin aria-hidden="true"/>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Disclaimer: This website provides webpage services only and does not
            host, produce, or store any video content. All videos are embedded
            from third-party sources. We do not take responsibility for their
            availability or copyright compliance. If you have any legal
            concerns, please contact the appropriate content providers.
          </p>
          <p>&copy; MovieVerse | Powered by TMDB API</p>
          <p>Email: MovieVerse@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterGuest;
