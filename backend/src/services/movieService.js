const Movie = require("../models/Movie");
const {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
} = require("./tmdbService");

// 1. Corrected parameters to accept categoryName
const transformMovie = (movie, categoryName) => ({
  title: movie.title,
  genre: [], // You can map genre_ids to names here later
  posterImgUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  description: movie.overview,
  director: "unknown",
  cast: [],
  category: [categoryName], // Now correctly scoped
  releaseYear:
    movie.release_date || movie.first_air_date
      ? new Date(movie.release_date || movie.first_air_date).getFullYear()
      : "N/A",
  averageRating: movie.vote_average,
  reviewCount: movie.vote_count,
  tmdbId: movie.id, // Highly recommended for tracking duplicates
});

const syncCategory = async (fetchFunction, categoryName) => {
  const rawMovies = await fetchFunction();

  // 2. Map the movies using the fixed transform function
  const transformedMovies = rawMovies.map((movie) =>
    transformMovie(movie, categoryName),
  );

  const savePromises = transformedMovies.map(async (movie) => {
    return await Movie.findOneAndUpdate(
      { tmdbId: movie.tmdbId }, // Better yet, use { tmdbId: movie.tmdbId }
      { $set: movie },
      { upsert: true, returnDocument: "after" },
    );
  });
  return Promise.all(savePromises);
};

const syncAllMovies = async () => {
  try {
    await syncCategory(fetchPopularMovies, "Popular");
    await syncCategory(fetchTopRatedMovies, "Top Rated");
    await syncCategory(fetchTrendingMovies, "Trending");
    console.log("All movies synced successfully.");
  } catch (error) {
    console.error("Sync failed:", error);
  }
};

const getMovies = async (filter = {}) => {
  return await Movie.find(filter);
};
const getMovieById = async (tmdbId) => {
  const movie = await Movie.findOne({ tmdbId: tmdbId });
  return movie;
};

module.exports = {
  syncAllMovies,
  getMovies,
  getMovieById,
};
