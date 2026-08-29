import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Navbar from "./components/Navbar/Navbar";
import Series from "./pages/Series/Series";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import KidsShows from "./pages/KidsShows/KidsShows";
import Profile from "./pages/Profile/Profile";
import Details from "./pages/Details/Details";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} token={token} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/kidsShows" element={<KidsShows />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<Details />} />
        </Routes>
      </div>
    </>
  );
}
export default App;
