require("dotenv").config();
const axios = require("axios");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    params: { api_key: API_KEY },
  });
  return response.data.results;
};

const fetchTrendingMovies = () => fetchFromTMDB("/trending/movie/week");
const fetchPopularMovies = () => fetchFromTMDB("/movie/popular");

module.exports = { fetchTrendingMovies, fetchPopularMovies };
