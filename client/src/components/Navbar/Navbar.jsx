import { useEffect, useRef, useState } from "react";
import "./Navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserCircle,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../services/api";

const Navbar = ({ setShowLogin, token, onLogout }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState("Home");
  const [profile, setProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // MOBILE MENU
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

    if (!query) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);

    setShowSearch(false);
    setSearchQuery("");

    // Close mobile menu if search is triggered there
    setShowMobileMenu(false);
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

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // ==========================================
  // MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const handleMobileNavigation = (pageName) => {
    setPage(pageName);
    closeMobileMenu();
  };

  return (
    <>
      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="navbar">
        {/* ==========================================
            HAMBURGER - MOBILE ONLY
        ========================================== */}

        <button
          className="hamburger-btn"
          onClick={() => setShowMobileMenu(true)}
          aria-label="Open menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* ==========================================
            LOGO
        ========================================== */}

        <Link to="/" className="navbar-logo" onClick={() => setPage("Home")}>
          <h1 className="title">Movie Info and Reviews</h1>
        </Link>

        {/* ==========================================
            DESKTOP CATEGORIES
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

          {/* LOGIN / PROFILE */}

          {!token ? (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          ) : (
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
      </nav>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      <div
        className={`mobile-overlay ${showMobileMenu ? "show" : ""}`}
        onClick={closeMobileMenu}
      />

      {/* ==========================================
          MOBILE MENU
      ========================================== */}

      <aside className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>
        {/* MOBILE MENU HEADER */}

        <div className="mobile-menu-header">
          <Link
            to="/"
            className="mobile-logo"
            onClick={() => handleMobileNavigation("Home")}
          >
            Movie Info
            <br />
            and Reviews
          </Link>

          <button
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* MOBILE LINKS */}

        <ul className="mobile-menu-list">
          <li>
            <Link
              to="/"
              className={page === "Home" ? "active" : ""}
              onClick={() => handleMobileNavigation("Home")}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/movies"
              className={page === "Movies" ? "active" : ""}
              onClick={() => handleMobileNavigation("Movies")}
            >
              Movies
            </Link>
          </li>

          <li>
            <Link
              to="/series"
              className={page === "Series" ? "active" : ""}
              onClick={() => handleMobileNavigation("Series")}
            >
              TV Shows
            </Link>
          </li>

          <li>
            <Link
              to="/kidsShows"
              className={page === "KidsShow" ? "active" : ""}
              onClick={() => handleMobileNavigation("KidsShow")}
            >
              Family
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Navbar;
