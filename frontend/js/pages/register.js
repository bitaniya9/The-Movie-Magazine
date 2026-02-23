import { signUp } from "../api/auth.api.js";

console.log("JS loaded");
const form = document.querySelector(".signIn-form");
console.log("Form: ", form);
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmError");

  passwordError.textContent = " ";
  confirmError.textContent = " ";

  let isValid = true;

  if (password !== confirmPassword) {
    confirmError.textContent = "Passwords don't match";
    isValid = false;
  }
  if (password.length < 8) {
    passwordError.textContent = "Passwords should at be least 8 characters";
    isValid = false;
  }

  if (isValid) {
    try {
      const data = await signUp({ name, email, password });
      console.log("Signed in:", data);
      window.location.href = "home.html";
    } catch (error) {
      alert(error.message);
    }
  }
});
