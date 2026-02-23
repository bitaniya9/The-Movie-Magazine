import { BASE_URL } from "../config.js";
//for login page
export async function login(data) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);
  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }
  localStorage.setItem("token", result.token);
  return result;
}

export function logout() {
  return localStorage.removeItem("token");
} //not async because localstorage is stored in the browser ,not db server and no network needed

export function getToken() {
  return localStorage.getItem("token");
}

export async function signUp(data) {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Sign up failed");
  }
  localStorage.setItem("token", result.token);
  return result;
}
