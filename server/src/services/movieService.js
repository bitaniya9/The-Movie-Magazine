const Movie = require("../models/Movie");
const {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchMovieDetails,
} = require("./tmdbService");

const transformMovie = (movie, categoryName) => ({
  title: movie.title,
  posterImgUrl: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined,
  description: movie.overview,
  category: [categoryName],
  releaseYear:
    movie.release_date || movie.first_air_date
      ? new Date(movie.release_date || movie.first_air_date).getFullYear()
      : "N/A",
  averageRating: movie.vote_average,
  reviewCount: movie.vote_count,
  tmdbId: movie.id,
});

const syncCategory = async (fetchFunction, categoryName) => {
  const rawMovies = await fetchFunction();

  const transformedMovies = rawMovies.map((movie) =>
    transformMovie(movie, categoryName),
  );

  const savePromises = transformedMovies.map(async (movie) => {
    return await Movie.findOneAndUpdate(
      { tmdbId: movie.tmdbId },
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

// tmdbId arrives as a route param string; Mongoose casts it to Number for the query.
const getMovieById = async (tmdbId) => {
  let movie = await Movie.findOne({ tmdbId });
  if (movie) return movie;

  // Not synced yet - happens for anything that only ever came from search,
  // genre browsing, Kids, or Series, since syncAllMovies only covers
  // Popular/TopRated/Trending. Fetch it directly from TMDB and persist it
  // so it gets a real Mongo _id that a review can reference.
  const raw = await fetchMovieDetails(tmdbId);
  if (!raw || !raw.id) return null;

  movie = await Movie.findOneAndUpdate(
    { tmdbId: raw.id },
    { $set: transformMovie(raw, "General") },
    { upsert: true, new: true },
  );
  return movie;
};

module.exports = {
  syncAllMovies,
  getMovies,
  getMovieById,
};
