import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./sidebar-youtube.css";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaHistory,
  FaPlayCircle,
  FaList,
  FaThumbsUp,
  FaDownload,
  FaCog,
  FaFlag,
  FaQuestionCircle,
  FaCommentDots,
  FaUserCircle,
  FaClock,
  FaMusic,
  FaGamepad,
  FaNewspaper,
  FaTrophy,
  FaLightbulb,
  FaPodcast,
  FaPlus,
  FaBroadcastTower,
  FaFilm,
  FaShoppingBag,
  FaYoutube,
  FaPlay,
  FaStar
} from "react-icons/fa";
import {
  MdSubscriptions,
  MdVideoLibrary,
  MdWhatshot,
  MdLiveTv,
  MdSports,
  MdPlaylistPlay,
  MdOutlineWatchLater,
  MdOutlineThumbUp,
  MdOutlineDownload,
  MdOutlinePlaylistAdd,
  MdOutlineSportsBaseball,
  MdOutlineSmartDisplay
} from "react-icons/md";
import MiniSidebar from "./MiniSidebar";

export default function Sidebar() {
  const { state, toggleTheme, toggleMenu } = useContext(AppContext);
  const authUser = state?.channel;

  // Function to handle link clicks - close sidebar on mobile, keep open on desktop
  const handleLinkClick = () => {
    if (window.innerWidth <= 1312) {
      toggleMenu(); // Close on mobile/tablet
    }
    // On desktop (>1312px), keep sidebar behavior as is
  };

  return (
    <>
      <div className={state?.onMenu ? "sidebar active" : "sidebar"}>
        <div className={`sidebar-wrapper ${state?.theme}`}>
          {/* Main navigation */}
          <div className="sidebar-section">
            <NavLink to="/" onClick={handleLinkClick} className="sidebar-item">
              <FaHome className="sidebar-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/shorts" onClick={handleLinkClick} className="sidebar-item">
              <MdOutlineSmartDisplay className="sidebar-icon" />
              <span>Shorts</span>
            </NavLink>
            {authUser ? (
              <NavLink to="/subscriptions" onClick={handleLinkClick} className="sidebar-item">
                <MdSubscriptions className="sidebar-icon" />
                <span>Subscriptions</span>
              </NavLink>
            ) : (
              <NavLink to="/login" onClick={handleLinkClick} className="sidebar-item">
                <MdSubscriptions className="sidebar-icon" />
                <span>Subscriptions</span>
              </NavLink>
            )}
          </div>

          <hr className="sidebar-separator" />

          {/* You section */}
          <div className="sidebar-section">
            <h3 className="sidebar-heading">You</h3>
            {authUser ? (
              <>
                <NavLink to="/channel" onClick={handleLinkClick} className="sidebar-item">
                  <FaUserCircle className="sidebar-icon" />
                  <span>Your channel</span>
                </NavLink>
                <NavLink to="/history" onClick={handleLinkClick} className="sidebar-item">
                  <FaHistory className="sidebar-icon" />
                  <span>History</span>
                </NavLink>
                <NavLink to="/playlists" onClick={handleLinkClick} className="sidebar-item">
                  <MdPlaylistPlay className="sidebar-icon" />
                  <span>Playlists</span>
                </NavLink>
                <NavLink to="/your-videos" onClick={handleLinkClick} className="sidebar-item">
                  <FaPlayCircle className="sidebar-icon" />
                  <span>Your videos</span>
                </NavLink>
                <NavLink to="/watch-later" onClick={handleLinkClick} className="sidebar-item">
                  <MdOutlineWatchLater className="sidebar-icon" />
                  <span>Watch later</span>
                </NavLink>
                <NavLink to="/liked" onClick={handleLinkClick} className="sidebar-item">
                  <MdOutlineThumbUp className="sidebar-icon" />
                  <span>Liked videos</span>
                </NavLink>
                <NavLink to="/downloads" onClick={handleLinkClick} className="sidebar-item">
                  <MdOutlineDownload className="sidebar-icon" />
                  <span>Downloads</span>
                </NavLink>
              </>
            ) : (
              <div className="sidebar-signin">
                <p>Sign in to like videos, comment, and subscribe.</p>
                <NavLink className="signin-button" to="/login" onClick={handleLinkClick}>
                  <FaUserCircle className="signin-icon" />
                  SIGN IN
                </NavLink>
              </div>
            )}
          </div>

          <hr className="sidebar-separator" />

          {/* Subscriptions section - only show when logged in */}
          {authUser && (
            <>
              <div className="sidebar-section">
                <h3 className="sidebar-heading">Subscriptions</h3>
                {/* Dynamic subscriptions would go here */}
                <div className="sidebar-item subscription-item">
                  <div className="subscription-avatar">
                    <img src="https://via.placeholder.com/24x24/cccccc/666666?text=C" alt="Channel" />
                  </div>
                  <span>Sample Channel</span>
                </div>
                <NavLink to="/subscriptions/all" onClick={handleLinkClick} className="sidebar-item">
                  <MdOutlinePlaylistAdd className="sidebar-icon" />
                  <span>Show more</span>
                </NavLink>
              </div>

              <hr className="sidebar-separator" />
            </>
          )}

          {/* Explore section */}
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Explore</h3>
            <NavLink to="/trending" onClick={handleLinkClick} className="sidebar-item">
              <MdWhatshot className="sidebar-icon" />
              <span>Trending</span>
            </NavLink>
            <NavLink to="/shopping" onClick={handleLinkClick} className="sidebar-item">
              <FaShoppingBag className="sidebar-icon" />
              <span>Shopping</span>
            </NavLink>
            <NavLink to="/music" onClick={handleLinkClick} className="sidebar-item">
              <FaMusic className="sidebar-icon" />
              <span>Music</span>
            </NavLink>
            <NavLink to="/movies" onClick={handleLinkClick} className="sidebar-item">
              <FaFilm className="sidebar-icon" />
              <span>Movies</span>
            </NavLink>
            <NavLink to="/live" onClick={handleLinkClick} className="sidebar-item">
              <MdLiveTv className="sidebar-icon" />
              <span>Live</span>
            </NavLink>
            <NavLink to="/gaming" onClick={handleLinkClick} className="sidebar-item">
              <FaGamepad className="sidebar-icon" />
              <span>Gaming</span>
            </NavLink>
            <NavLink to="/news" onClick={handleLinkClick} className="sidebar-item">
              <FaNewspaper className="sidebar-icon" />
              <span>News</span>
            </NavLink>
            <NavLink to="/sports" onClick={handleLinkClick} className="sidebar-item">
              <MdOutlineSportsBaseball className="sidebar-icon" />
              <span>Sports</span>
            </NavLink>
            <NavLink to="/learning" onClick={handleLinkClick} className="sidebar-item">
              <FaLightbulb className="sidebar-icon" />
              <span>Courses</span>
            </NavLink>
            <NavLink to="/fashion" onClick={handleLinkClick} className="sidebar-item">
              <FaStar className="sidebar-icon" />
              <span>Fashion & Beauty</span>
            </NavLink>
            <NavLink to="/podcasts" onClick={handleLinkClick} className="sidebar-item">
              <FaPodcast className="sidebar-icon" />
              <span>Podcasts</span>
            </NavLink>
          </div>

          <hr className="sidebar-separator" />

          {/* More from YouTube section */}
          <div className="sidebar-section">
            <h3 className="sidebar-heading">More from YouTube</h3>
            <NavLink to="/premium" onClick={handleLinkClick} className="sidebar-item">
              <FaYoutube className="sidebar-icon youtube-premium" />
              <span>YouTube Premium</span>
            </NavLink>
            <NavLink to="/studio" onClick={handleLinkClick} className="sidebar-item">
              <FaBroadcastTower className="sidebar-icon" />
              <span>YouTube Studio</span>
            </NavLink>
            <NavLink to="/music-app" onClick={handleLinkClick} className="sidebar-item">
              <FaMusic className="sidebar-icon" />
              <span>YouTube Music</span>
            </NavLink>
            <NavLink to="/kids" onClick={handleLinkClick} className="sidebar-item">
              <FaPlay className="sidebar-icon" />
              <span>YouTube Kids</span>
            </NavLink>
          </div>

          <hr className="sidebar-separator" />

          {/* Settings and other options */}
          <div className="sidebar-section">
            <NavLink to="/settings" onClick={handleLinkClick} className="sidebar-item">
              <FaCog className="sidebar-icon" />
              <span>Settings</span>
            </NavLink>
            <NavLink to="/report" onClick={handleLinkClick} className="sidebar-item">
              <FaFlag className="sidebar-icon" />
              <span>Report history</span>
            </NavLink>
            <NavLink to="/help" onClick={handleLinkClick} className="sidebar-item">
              <FaQuestionCircle className="sidebar-icon" />
              <span>Help</span>
            </NavLink>
            <NavLink to="/feedback" onClick={handleLinkClick} className="sidebar-item">
              <FaCommentDots className="sidebar-icon" />
              <span>Send feedback</span>
            </NavLink>
          </div>

          <hr className="sidebar-separator" />

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="sidebar-links">
              <a href="/about">About</a>
              <a href="/press">Press</a>
              <a href="/copyright">Copyright</a>
              <a href="/contact">Contact us</a>
              <a href="/creators">Creators</a>
              <a href="/advertise">Advertise</a>
              <a href="/developers">Developers</a>
            </div>
            <div className="sidebar-links">
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/policy">Policy & Safety</a>
              <a href="/how-youtube-works">How YouTube works</a>
              <a href="/new-features">Test new features</a>
            </div>
            <div className="sidebar-copyright">
              © 2024 Google LLC
            </div>
          </div>
        </div>
        <div className="sidebar-overlay" onClick={toggleMenu}></div>
      </div>

      <MiniSidebar />
    </>
  );
}
