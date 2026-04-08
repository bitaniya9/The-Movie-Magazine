import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Note the v1 to match your router!
});

export const fetchTrendingMovies = async () => {
  try {
    const response = await API.get("/movies?category=Trending");
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    return [];
  }
};

// You can add more later:
// export const fetchPopular = () => API.get("/movies?category=Popular");
