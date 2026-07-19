require("dotenv").config();
const axios = require("axios");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint, extraParams = {}) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    params: { api_key: API_KEY, ...extraParams },
  });
  return response.data.results;
};

const fetchTrendingMovies = () => fetchFromTMDB("/trending/movie/week");
const fetchPopularMovies = () => fetchFromTMDB("/movie/popular");
const fetchTopRatedMovies = () => fetchFromTMDB("/movie/top_rated");
const fetchSeries = () => fetchFromTMDB("/tv/popular");
const fetchKidsMovies = async () => {
  const params = {
    // Using a comma here means: Animation AND Family
    with_genres: "16,10751",
    certification_country: "US",
    "certification.lte": "PG",
    // Explicitly exclude Horror, Thriller, and Crime
    without_genres: "27,53,80",
    include_adult: false,
    sort_by: "popularity.desc",
  };

  // DEBUG: Check your terminal to see if these params are actually being used!
  console.log("Requesting Kids Movies with params:", params);

  return await fetchFromTMDB("/discover/movie", params);
};
module.exports = {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchSeries,
  fetchKidsMovies,
};
