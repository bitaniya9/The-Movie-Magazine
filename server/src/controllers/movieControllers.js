const {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchKidsMovies,
  fetchSeries,
  discoverMovies,
  searchMovies: searchMoviesFromTMDB,
} = require("../services/tmdbService");
const { getMovieById } = require("../services/movieService");

const getAllMovies = async (req, res) => {
  try {
    const { category } = req.query;
    const page = Number(req.query.page) || 1;
    let data;

    // 1. Fetch from Service
    if (category === "Trending") {
      data = await fetchTrendingMovies(page);
    } else if (category === "TopRated") {
      data = await fetchTopRatedMovies(page);
    } else if (category === "Kids") {
      data = await fetchKidsMovies(page);
    } else if (category === "Series") {
      data = await fetchSeries(page);
    } else {
      data = await discoverMovies(page);
    }

    const rawMovies = data.results || [];

    // 2. Transform the data so React can read it easily
    const transformed = rawMovies.map((m) => ({
      _id: m.id,
      title: m.title || m.name || "Untitled",
      posterImgUrl: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      releaseYear:
        (m.release_date || m.first_air_date || "").split("-")[0] || "N/A",
      averageRating: m.vote_average,
      category: [category || "Discover"],
      description: m.overview,
      tmdbId: m.id,
    }));

    // 3. Send the clean data to the frontend
    res.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: transformed,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const page = Number(req.query.page) || 1;

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }
    const data = await searchMoviesFromTMDB(query.trim(), page);

    const transformed = (data.results || []).map((m) => ({
      _id: m.id,
      title: m.title || "Untitled",
      posterImgUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : undefined,

      releaseYear: (m.release_date || "").split("-")[0] || "N/A",

      averageRating: m.vote_average,

      category: ["Search"],

      description: m.overview,

      tmdbId: m.id,
    }));
    res.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: transformed,
    });
  } catch (error) {
    console.error("Search Controller Error:", error.message);

    res.status(500).json({
      error: "Failed to search movies",
    });
  }
};

const getMoviesById = async (request, response) => {
  try {
    const { id } = request.params;
    const movie = await getMovieById(id);
    if (!movie) {
      return response.status(400).json({
        message: "Movie not found",
      });
    }
    response.status(200).json({ movie });
  } catch (error) {
    response.status(500).json({ message: error.message });
    console.log("Searching for movie with TMDB ID:", id);
  }
};

// 4. Export it so the Router can see it
module.exports = { getAllMovies, searchMovies, getMoviesById };
