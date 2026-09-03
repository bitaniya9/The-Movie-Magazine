import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Note the v1 to match your router!
});

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchMoviesByCategory = async (category, page = 1) => {
  try {
    const response = await API.get("/movies", { params: { category, page } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} movies: `, error.message);
    return { page: 1, total_pages: 0, total_results: 0, results: [] };
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await API.get("/movies/search", {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error.message);
    return {
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: [],
    };
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
export const fetchMovieById = async (id, mediaType = "movie") => {
  try {
    const response = await API.get(`/movie/${id}`, {
      params: {
        type: mediaType,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error getting movie details", error.message);
    throw error;
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

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await API.get(`/movies/genre/${genreId}`, {
      params: { page },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching genre movies:", error.message);

    return {
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: [],
    };
  }
};

export const toggleFavorite = async (movieId) => {
  const token = localStorage.getItem("token");

  const response = await API.put(
    "/users/favorites",
    { movieId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const toggleWatchlist = async (movieId) => {
  const token = localStorage.getItem("token");

  const response = await API.put(
    "/users/watchlist",
    { movieId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
