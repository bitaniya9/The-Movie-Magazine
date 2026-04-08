const {
  fetchTrendingMovies,
  fetchPopularMovies,
} = require("../services/tmdbService");

const getAllMovies = async (req, res) => {
  try {
    const { category } = req.query;
    let rawMovies = [];

    // 1. Fetch from Service
    if (category === "Trending") {
      rawMovies = await fetchTrendingMovies();
    } else {
      rawMovies = await fetchPopularMovies();
    }

    // 2. Transform the data so React can read it easily
    const transformed = rawMovies.map((m) => ({
      _id: m.id,
      title: m.title || m.name,
      posterImgUrl: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      releaseYear: (m.release_date || m.first_air_date || "").split("-")[0],
      averageRating: m.vote_average,
      category: [category || "Popular"],
      description: m.overview,
    }));

    // 3. Send the clean data to the frontend
    res.json(transformed);
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// 4. Export it so the Router can see it
module.exports = { getAllMovies };
