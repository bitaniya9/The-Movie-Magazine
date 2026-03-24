const Movie = require("../models/Movie");
const { fetchPopularMovies } = require("./tmdbService");

const transformMovie = (movie) => ({
  title: movie.title,
  genre: [],
});
