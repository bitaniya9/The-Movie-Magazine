// import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Navbar from "./components/Navbar/Navbar";
function App() {
  // const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {/* {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>} */}
      <div className="app">
        <Navbar />
      </div>
    </>
  );
}
export default App;
