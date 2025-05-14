import { Link } from "react-router-dom";
import "../styles/footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const handleWatchlistClick = () => {
    navigate("/profile", { state: { targetTab: "WatchList" } });
  };
  const handleRecommendationClick = () => {
    navigate("/recommendation", { state: { targetTab: "Recommendation" } });
  };

  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label="Website footer with navigation and contact information"
    >
      <div className="footer-container">
        <div className="footer-grid">
          <section aria-labelledby="home-heading">
            <h4 id="home-heading">Home</h4>
            <nav aria-label="Home section navigation">
              <ul role="list">
                <li role="listitem">
                  <Link
                    to="/watchlist"
                    aria-label="Navigate to Watchlist page"
                    onClick={handleWatchlistClick}
                  >
                    Watchlist
                  </Link>
                </li>
                <li role="listitem">
                  <Link to="/ranking" aria-label="Navigate to Ranking page">
                    Ranking
                  </Link>
                </li>
                <li role="listitem">
                  <Link
                    to="/directory/new"
                    aria-label="Navigate to New Releases page"
                  >
                    New Released
                  </Link>
                </li>
                <li role="listitem">
                  <Link
                    to="/recommendation"
                    aria-label="Navigate to Recommendations page"
                    onClick={handleRecommendationClick}
                  >
                    Recommendation
                  </Link>
                </li>
              </ul>
            </nav>
          </section>

          <section aria-labelledby="directory-heading">
            <h4 id="directory-heading">Directory</h4>
            <nav aria-label="Directory section navigation">
              <ul role="list">
                <li role="listitem">
                  <Link
                    to="/directory"
                    aria-label="Navigate to Movie Directory"
                  >
                    Directory
                  </Link>
                </li>
              </ul>
            </nav>
          </section>

          <section aria-labelledby="ranking-heading">
            <h4 id="ranking-heading">Ranking</h4>
            <nav aria-label="Ranking section navigation">
              <ul role="list">
                <li role="listitem">
                  <Link to="/ranking" aria-label="Navigate to Movie Rankings">
                    Ranking
                  </Link>
                </li>
              </ul>
            </nav>
          </section>

          <section aria-labelledby="profile-heading">
            <h4 id="profile-heading">Profile</h4>
            <nav aria-label="Profile section navigation">
              <ul role="list">
                <li role="listitem">
                  <Link to="/profile" aria-label="Contact us page">
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </section>

          <section aria-labelledby="social-heading">
            <h4 id="social-heading">Connect With Us</h4>
            <div
              className="social-icons"
              role="group"
              aria-label="Social media links"
            >
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page (opens in new tab)"
              >
                <FaFacebook aria-hidden="true" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter page (opens in new tab)"
              >
                <FaXTwitter aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page (opens in new tab)"
              >
                <FaLinkedin aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        <div
          className="footer-bottom"
          aria-label="Legal disclaimer and copyright information"
        >
          <p role="contentinfo">
            Disclaimer: This website provides webpage services only and does not
            host, produce, or store any video content. All videos are embedded
            from third-party sources. We do not take responsibility for their
            availability or copyright compliance. If you have any legal
            concerns, please contact the appropriate content providers.
          </p>
          <p role="contentinfo">&copy; MovieVerse | Powered by TMDB API</p>
          <p role="contentinfo">
            Email:{" "}
            <a
              href="mailto:MovieVerse@gmail.com"
              aria-label="Send email to MovieVerse"
            >
              MovieVerse@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
