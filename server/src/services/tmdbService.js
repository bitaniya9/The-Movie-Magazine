require("dotenv").config();
const axios = require("axios");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint, extraParams = {}) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    params: { api_key: API_KEY, ...extraParams },
  });
  return response.data;
};

const fetchTrendingMovies = (page = 1) =>
  fetchFromTMDB("/trending/movie/week", { page });
const fetchPopularMovies = (page = 1) =>
  fetchFromTMDB("/movie/popular", { page });
const fetchTopRatedMovies = (page = 1) =>
  fetchFromTMDB("/movie/top_rated", { page });
const fetchSeries = (page = 1) => fetchFromTMDB("/tv/popular", { page });
const fetchKidsMovies = (page = 1) => {
  const params = {
    // Using a comma here means: Animation AND Family
    with_genres: "16|10751",
    certification_country: "US",
    "certification.lte": "PG",
    // Explicitly exclude Horror, Thriller, and Crime
    without_genres: "27,53,80",
    include_adult: false,
    sort_by: "popularity.desc",
    page,
  };

  // DEBUG: Check your terminal to see if these params are actually being used!
  console.log("Requesting Kids Movies with params:", params);

  return fetchFromTMDB("/discover/movie", params);
};
const discoverMovies = (page = 1) =>
  fetchFromTMDB("/discover/movie", {
    page,
    include_adult: false,
    sort_by: "popularity.desc",
  });

// --- Search & genre browsing ---

const searchMovies = (query, page = 1) =>
  fetchFromTMDB("/search/multi", { query, page, include_adult: false });

const discoverMoviesByGenre = (genreId, page = 1) =>
  fetchFromTMDB("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
    include_adult: false,
  });

// TMDB's genre list endpoint returns { genres: [...] }, not { results: [...] },
// so it can't reuse fetchFromTMDB.
const fetchGenreList = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: API_KEY },
  });
  return response.data.genres; // [{ id, name }, ...]
};

// Also not a { results: [...] } shape - returns the full movie object directly.
const fetchMovieDetails = async (tmdbId) => {
  const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
    params: { api_key: API_KEY },
  });
  return response.data;
};
const fetchTVDetails = async (tmdbId) => {
  const response = await axios.get(`${BASE_URL}/tv/${tmdbId}`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data;
};

module.exports = {
  fetchTVDetails,
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  discoverMovies,
  fetchSeries,
  fetchKidsMovies,
  searchMovies,
  discoverMoviesByGenre,
  fetchGenreList,
  fetchMovieDetails,
};
