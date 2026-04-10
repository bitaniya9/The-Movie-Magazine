const {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchKidsMovies,
  fetchSeries,
} = require("../services/tmdbService");
const { getMovieById } = require("../services/movieService");

const getAllMovies = async (req, res) => {
  try {
    const { category } = req.query;
    let rawMovies = [];

    // 1. Fetch from Service
    if (category === "Trending") {
      rawMovies = await fetchTrendingMovies();
    } else if (category === "TopRated") {
      rawMovies = await fetchTopRatedMovies();
    } else if (category === "Kids") {
      rawMovies = await fetchKidsMovies();
    } else if (category === "Series") {
      rawMovies = await fetchSeries();
      console.log("SERIES RAW DATA SAMPLE:", rawMovies[0]);
    }

    // 2. Transform the data so React can read it easily
    const transformed = rawMovies.map((m) => ({
      _id: m.id,
      title: m.title || m.name || "Untitled",
      posterImgUrl: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      releaseYear:
        (m.release_date || m.first_air_date || "").split("-")[0] || "N/A",
      averageRating: m.vote_average,
      category: [category || "General"],
      description: m.overview,
    }));

    // 3. Send the clean data to the frontend
    res.json(transformed);
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};
const getMoviesById = async (request, response) => {
  try {
    const { id } = request.params;
    const movie = await getMovieById(id);
    response.status(200).json({ movie });
  } catch (error) {
    response.status(500).json({ message: error.message });
    console.log("Searching for movie with TMDB ID:", id);
  }
};

// 4. Export it so the Router can see it
module.exports = { getAllMovies, getMoviesById };
