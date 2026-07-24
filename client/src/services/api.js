import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Note the v1 to match your router!
});

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
      headers: authHeader(),
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

// Reviews ------------------------------------------------------------
// params can include { page, limit, userId }
export const getReviews = async (movieId, params = {}) => {
  const response = await API.get("/reviews", {
    params: { movieId, ...params },
  });
  // response.data is { success, data: { data: [...reviews], total, page, totalPages } }
  return response.data.data;
};

export const postReview = async (review) => {
  const response = await API.post("/reviews", review, {
    headers: authHeader(),
  });
  return response.data;
};

export const updateReview = async (id, review) => {
  // previously hit API.patch("", ...) which dropped the id entirely
  const response = await API.patch(`/reviews/${id}`, review, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await API.delete(`/reviews/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

// You can add more later:
// export const fetchPopular = () => API.get("/movies?category=Popular");
