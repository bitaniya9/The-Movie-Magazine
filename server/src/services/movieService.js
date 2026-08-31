const { Query } = require("mongoose");
const Movie = require("../models/Movie");
const {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchMovieDetails,
  discoverMovies,
  searchMovies: searchMoviesFromTMDB,
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

const syncCategory = async (fetchFunction, categoryName, pages = 1) => {
  const allMovies = [];

  for (let page = 1; page <= pages; page++) {
    const data = await fetchFunction(page);

    if (data && data.results) {
      allMovies.push(...data.results);
    }
  }
  const transformedMovies = allMovies.map((movie) =>
    transformMovie(movie, categoryName),
  );

  const savePromises = transformedMovies.map(async (movie) => {
    return await Movie.findOneAndUpdate(
      { tmdbId: movie.tmdbId },
      { $set: movie },
      { upsert: true, returnDocument: true },
    );
  });
  return Promise.all(savePromises);
};

const syncAllMovies = async () => {
  try {
    await syncCategory(fetchPopularMovies, "Popular", 5);
    await syncCategory(fetchTopRatedMovies, "Top Rated", 5);
    await syncCategory(fetchTrendingMovies, "Trending", 1);
    console.log("All movies synced successfully.");
  } catch (error) {
    console.error("Sync failed:", error);
  }
};

const getMovies = async (filter = {}) => {
  return await Movie.find(filter);
};

const getDiscoverMovies = async (page = 1) => {
  const data = await discoverMovies(page);

  const transformedMovies = data.results.map((movie) =>
    transformMovie(movie, "Discover"),
  );
  return {
    page: data.page,
    results: transformedMovies,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};
const searchMovies = async (Query, page = 1) => {
  if (!query || !query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
  const data = await searchMoviesFromTMDB(query.trim(), page);

  const transformedMovies = data.results.map((movie) =>
    transformMovie(movie, "Search"),
  );

  return {
    page: data.page,
    results: transformedMovies,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

const getMovieById = async (tmdbId) => {
  let movie = await Movie.findOne({ tmdbId });

  if (movie) {
    return movie;
  }

  const raw = await fetchMovieDetails(tmdbId);

  if (!raw || !raw.id) {
    return null;
  }

  movie = await Movie.findOneAndUpdate(
    { tmdbId: raw.id },
    {
      $set: transformMovie(raw, "General"),
    },
    {
      upsert: true,
      returnDocument: true,
    },
  );
  return movie;
};

module.exports = {
  syncAllMovies,
  getMovies,
  getDiscoverMovies,
  searchMovies,
  getMovieById,
};
