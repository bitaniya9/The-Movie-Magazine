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
  releaseYear: movie.release_date
    ? new Date(movie.release_date).getFullYear()
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

  // 3. Use bulkWrite or parallel updates instead of insertMany + Loop
  // This avoids duplicate key errors and is much faster
  const syncPromises = transformedMovies.map((movie) =>
    Movie.updateOne(
      { title: movie.title }, // Better yet, use { tmdbId: movie.tmdbId }
      { $set: movie },
      { upsert: true },
    ),
  );

  await Promise.all(syncPromises);
  console.log(`Synced ${categoryName} category.`);
  return transformedMovies;
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

module.exports = {
  syncAllMovies,
  getMovies,
};
