const Movie = require("../models/Movie");
const {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
} = require("./tmdbService");

const transformMovie = (movie) => ({
  title: movie.title,
  genre: [],
  posterImgUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  description: movie.overview,
  director: "unknown",
  cast: [],
  category: [category],
  releaseYear: new Date(movie.release_date).getFullYear(),
  averageRating: movie.vote.average,
  reviewCount: movie.vote_count,
});
const syncCategory = async (fetchFunction, categoryName) => {
  const rawMovies = await fetchFunction();
  const transformedMovies = rawMovies.map((movie) =>
    transformMovie(movie, categoryName),
  ); //Why use this here?
  await Movie.insertMany(transformedMovies);

  for (const movie of transformedMovies) {
    await Movie.updateOne(
      { title: movie.title },
      { $set: movie }, //$set = MongoDB operator.It updates the document with all fields from movie.
      { upsert: true },
    );
  }

  return transformedMovies;
};
const syncAllMovies = async () => {
  await syncCategory(fetchPopularMovies, "Popular");
  await syncCategory(fetchPopularMovies, "Top Rated");
  await syncCategory(fetchTrendingMovies, "Trending");
};
const getMovies = async (filter = {}) => {
  return await Movie.find(filter);
};
module.exports = {
  syncAllCategory,
  getMovies,
};
