// import { Link } from "react-router-dom";
// import "../styles/footer.css";
// const Footer = () => {
//   return (
//     <footer id="footer">
//       <ul>
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/directory">Directory</Link>
//         </li>
//         <li>
//           <Link to="/ranking">Ranking</Link>
//         </li>
//         <li>
//           <Link to="/profile">Profile</Link>
//         </li>
//       </ul>
//       <div>
//         <p>
//           Disclaimer: This website provides webpage services only and does not
//           host, produce, or store any video content. All videos are embedded
//           from third-party sources, and we do not take responsibility for their
//           availability or copyright compliance. If you have any legal concerns,
//           please contact the appropriate content providers.
//         </p>
//         <p>&copy; MovieVerse | Powered by TMDB API</p>
//         <a href="mailto:movieverse@gmail.com">movieverse@gmail.com</a>
//       </div>
//     </footer>
//   );
// };
// export default Footer;
import { Link } from "react-router-dom";
import "../styles/footer.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
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
    <footer id="footer" role="contentinfo" aria-label="Main footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h4>Home</h4>
            <nav aria-label="Home navigation">
              <ul>
                <li>
                  <Link to="/watchlist">Watchlist</Link>
                </li>
                <li>
                  <Link to="/ranking">Ranking</Link>
                </li>
                <li>
                  <Link to="/directory/new">New Released</Link>
                </li>
                <li>
                  <Link to="/recommendation">Recommendation</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4>Directory</h4>
            <nav aria-label="Directory navigation">
              <ul>
                <li>
                  <Link to="/directory">Directory</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4>Ranking</h4>
            <nav aria-label="Ranking navigation">
              <ul>
                <li>
                  <Link to="/ranking">Ranking</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4>Profile</h4>
            <nav aria-label="Profile navigation">
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
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

export default Footer;
