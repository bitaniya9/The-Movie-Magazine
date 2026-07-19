import { useState } from "react";
import { loginUser, signUser } from "../../services/api";
import "./LoginPopup.css";
// import "../assets";

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onChangleHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const onLogin = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    try {
      let response;
      if (currState === "Login") {
        response = await loginUser({
          email: data.email,
          password: data.password,
        });
      } else {
        response = await signUser(data);
      }

      // Success!
      localStorage.setItem("token", response.token);
      setShowLogin(false);
      window.location.reload();
    } catch (error) {
      let message = error.response?.data?.message || "Something went wrong";

      if (typeof message === "string" && message.startsWith("[")) {
        try {
          const parsed = JSON.parse(message);
          message = parsed[0]?.message || message;
        } catch (e) {
          // If it looks like JSON but isn't, just leave it as is
        }
      }

      setErrorMsg(message);
      console.log("Error Details:", error.message);
    }
  };
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src="/assets/x_icon.png"
            alt="close"
          />
        </div>
        {errorMsg && (
          <p className="error-text" style={{ color: "red", fontSize: "12px" }}>
            {errorMsg}
          </p>
        )}
        <div className="login-popup-inputs">
          {currState === "Sign up" && (
            <input
              name="name"
              onChange={onChangleHandler}
              value={data.name}
              type="text"
              placeholder="Your Name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangleHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            type="password"
            onChange={onChangleHandler}
            value={data.password}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Create Account" : "Login"}
        </button>
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
      </form>
    </div>
  );
}
export default LoginPopup;
