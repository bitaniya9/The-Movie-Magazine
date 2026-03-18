import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <h1 className="logo">Movie Review</h1>
      </div>
      <div className="navbar-search-icon">
        <FontAwesomeIcon icon={faSearch} className="icons" />
      </div>
    </>
  );
};
export default Navbar;
