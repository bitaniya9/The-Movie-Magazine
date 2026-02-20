import { login } from "../api/auth.api.js";

const form = document.querySelector(".login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    const data = await login({ email, password });
    console.log("Logged in:", data);
    window.location.href = "home.html";
  } catch (error) {
    alert(error.message);
  }
});
