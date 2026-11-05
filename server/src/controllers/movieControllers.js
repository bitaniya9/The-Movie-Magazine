const {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchKidsMovies,
  fetchSeries,
  discoverMovies,
  discoverMoviesByGenre,
} = require("../services/tmdbService");

const {
  getMovieById,
  getDiscoverMovies,
  searchMovies: searchMoviesFromService,
  transformMovie,
  saveMovies,
} = require("../services/movieService");

// ==========================================
// GET MOVIES BY GENRE
// ==========================================

const getMoviesByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const page = Number(req.query.page) || 1;

    const data = await discoverMoviesByGenre(genreId, page);

    const transformed = (data.results || []).map((movie) =>
      transformMovie(movie, "Movies", "movie"),
    );

    const savedMovies = await saveMovies(transformed);

    res.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: savedMovies,
    });
  } catch (error) {
    console.error("Genre Controller Error:", error.message);

    res.status(500).json({
      error: "Failed to fetch movies by genre",
    });
  }
};

// ==========================================
// GET ALL MOVIES
// ==========================================

const getAllMovies = async (req, res) => {
  try {
    const { category } = req.query;
    const page = Number(req.query.page) || 1;

    let data;
    let mediaType = "movie";
    let categoryName = category || "Discover";

    if (category === "Trending") {
      data = await fetchTrendingMovies(page);
    } else if (category === "TopRated") {
      data = await fetchTopRatedMovies(page);
      categoryName = "Top Rated";
    } else if (category === "Kids") {
      data = await fetchKidsMovies(page);
    } else if (category === "Series") {
      data = await fetchSeries(page);
      mediaType = "tv";
    } else {
      data = await discoverMovies(page);
    }

    const transformed = (data.results || []).map((movie) =>
      transformMovie(movie, categoryName, mediaType),
    );

    const savedMovies = await saveMovies(transformed);

    res.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: savedMovies,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      error: "Failed to fetch movies",
    });
  }
};

// ==========================================
// SEARCH MOVIES AND TV SERIES
// ==========================================

const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const page = Number(req.query.page) || 1;

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    const data = await searchMoviesFromService(query.trim(), page);

    res.json(data);
  } catch (error) {
    console.error("Search Controller Error:", error.message);

    res.status(500).json({
      error: "Failed to search movies",
    });
  }
};

// ==========================================
// GET MOVIE / TV DETAILS
// ==========================================

const getMoviesById = async (request, response) => {
  const { id } = request.params;

  try {
    const { type } = request.query;
    const mediaType = type === "tv" ? "tv" : "movie";

    const movie = await getMovieById(id, mediaType);

    if (!movie) {
      return response.status(404).json({
        message: "Movie/TV not found",
      });
    }

    response.status(200).json({ movie });
  } catch (error) {
    console.error("Movie Details Controller Error:", error.message);

    response.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllMovies,
  searchMovies,
  getMoviesById,
  getMoviesByGenre,
};
