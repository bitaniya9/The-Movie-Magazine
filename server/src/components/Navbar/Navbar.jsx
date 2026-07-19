import { useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Added faUserCircle
import { Link } from "react-router-dom";

const Navbar = ({ setShowLogin, token }) => {
  // Assume 'token' is passed to check if logged in
  const [page, setPage] = useState("Home");

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
        <FontAwesomeIcon icon={faSearch} className="icons" />

        {!token ? (
          /* Show Login button if NOT logged in */
          <button onClick={() => setShowLogin(true)}>Login</button>
        ) : (
          /* Show Profile Icon if logged in */
          <div className="navbar-profile">
            <Link to="/profile">
              <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
            </Link>
            {/* You can add a logout dropdown here later */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
