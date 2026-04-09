import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Note the v1 to match your router!
});

export const fetchMoviesByCategory = async (category) => {
  try {
    const response = await API.get(`/movies?category=${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} movies: `, error.message);
    return [];
  }
};
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    console.log("Error logging in", error.message);
  }
};
export const signUser = async (data) => {
  try {
    const response = await API.post("/users/signin", data);
    return response.data;
  } catch (error) {
    console.log("Error signing in", error.message);
  }
};
export const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token identified");
    }
    const response = await API.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user information", error.message);
    throw error;
  }
};
// You can add more later:
// export const fetchPopular = () => API.get("/movies?category=Popular");
