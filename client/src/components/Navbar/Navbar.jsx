import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../services/api";

const Navbar = ({ setShowLogin, token, onLogout }) => {
  const [page, setPage] = useState("Home");
  const [profile, setProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setProfile(null);
      return;
    }
    fetchUserInfo()
      .then((payload) => setProfile(payload?.data || payload))
      .catch(() => setProfile(null));
  }, [token]);

  // close the profile dropdown on an outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="navbar">
      <Link to="/" onClick={() => setPage("Home")}>
        <h1 className="title">Movie Review</h1>
      </Link>

      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            onClick={() => setPage("Home")}
            className={page === "Home" ? "active" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/movies"
            onClick={() => setPage("Movies")}
            className={page === "Movies" ? "active" : ""}
          >
            Movies
          </Link>
        </li>
        <li>
          <Link
            to="/series"
            onClick={() => setPage("Series")}
            className={page === "Series" ? "active" : ""}
          >
            TV Shows
          </Link>
        </li>
        <li>
          <Link
            to="/kidsShows"
            onClick={() => setPage("KidsShow")}
            className={page === "KidsShow" ? "active" : ""}
          >
            Kids
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        <Link
          to="/search"
          className="icons"
          onClick={() => setPage("Search")}
          aria-label="Search"
        >
          <FontAwesomeIcon icon={faSearch} />
        </Link>

        {!token ? (
          /* Show Login button if NOT logged in */
          <button onClick={() => setShowLogin(true)}>Login</button>
        ) : (
          /* Show Profile Icon if logged in */
          <div className="navbar-profile" ref={menuRef}>
            <button
              className="profile-trigger"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-label="Account menu"
            >
              <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                {profile?.name && (
                  <p className="profile-name">{profile.name}</p>
                )}
                <Link to="/profile" onClick={() => setShowProfileMenu(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
