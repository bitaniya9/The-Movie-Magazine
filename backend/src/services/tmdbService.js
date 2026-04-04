const axios = require("axios");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async () => {
  const response = await axios.get(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  return response.data.results;
};
const fetchPopularMovies = () => fetchFromTMDB("/movie/popular");
const fetchTopRatedMovies = () => fetchFromTMDB("/movie/top_rated");
const fetchTrendingMovies = () => fetchFromTMDB("/trending/movie/day");

module.exports = {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
};
