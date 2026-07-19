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
    throw error;
  }
};
export const signUser = async (data) => {
  try {
    const response = await API.post("/users/signin", data);
    return response.data;
  } catch (error) {
    console.log("Error signing in", error.message);
    throw error;
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
export const fetchMovieById = async (id) => {
  try {
    const response = await API.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error getting movie details", error.message);
  }
};

export const getReviews = async (movieId) => {
  const response = await API.get("/reviews", { params: { movieId } });
  return response.data.data;
};
export const postReview = async (review) => {
  const token = localStorage.getItem("token");
  const response = await API.post("/reviews", review, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteReview = async (id) => {
  const token = localStorage.getItem("token");
  return API.delete(`/reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateReview = async (id, review) => {
  const token = localStorage.getItem("token");
  return API.patch("", review, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// You can add more later:
// export const fetchPopular = () => API.get("/movies?category=Popular");
