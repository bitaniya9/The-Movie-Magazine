import { useState } from "react";

import "./LoginPopup.css";
// import "../assets";

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");
  return (
    <form className="login-popup">
      <div className="login-popup-container">
        <h2>{currState}</h2>
        <img
          onClick={() => setShowLogin(false)}
          src="/assets/x_icon.png"
          alt="close"
        />
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input type="text" placeholder="Your Name" required />
          )}
          <input type="email" placeholder="Your email" required />
          <input type="text" placeholder="Password" required />
        </div>
        <button>{currState === "Sign up" ? "Create Account" : "Login"}</button>
        {currState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </div>
    </form>
  );
}
export default LoginPopup;
