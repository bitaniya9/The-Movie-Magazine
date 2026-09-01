import { useEffect, useRef, useState } from "react";
import "./Navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../services/api";

const Navbar = ({ setShowLogin, token, onLogout }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState("Home");
  const [profile, setProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  // ==========================================
  // GET USER PROFILE
  // ==========================================

  useEffect(() => {
    if (!token) {
      setProfile(null);
      return;
    }

    fetchUserInfo()
      .then((payload) => setProfile(payload?.data || payload))
      .catch(() => setProfile(null));
  }, [token]);

  // ==========================================
  // CLOSE PROFILE DROPDOWN
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    // Navigate to search results page
    navigate(`/search?query=${encodeURIComponent(query)}`);

    // Close search box
    setShowSearch(false);

    // Clear input
    setSearchQuery("");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

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

  // ==========================================
  // TOGGLE SEARCH
  // ==========================================

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);

    // Focus input after it appears
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="navbar">
      {/* ==========================================
          LOGO
      ========================================== */}

      <Link to="/" onClick={() => setPage("Home")}>
        <h1 className="title">Movie Info and Reviews</h1>
      </Link>

      {/* ==========================================
          CATEGORIES
      ========================================== */}

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

      {/* ==========================================
          SEARCH + PROFILE
      ========================================== */}

      <div className="navbar-right">
        {/* SEARCH */}

        <form className="search-container" onSubmit={handleSearch}>
          {showSearch && (
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <button
            type="button"
            className="search-btn"
            onClick={handleSearchToggle}
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* LOGIN */}

        {!token ? (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        ) : (
          /* PROFILE */

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
                <div className="profile-info">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="dropdown-profile-icon"
                  />

                  <div>
                    <p className="profile-name">{profile?.name || "User"}</p>

                    <p className="profile-email">{profile?.email || ""}</p>
                  </div>
                </div>

                <div className="dropdown-divider" />

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
