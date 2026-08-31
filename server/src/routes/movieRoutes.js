const express = require("express");
const router = express.Router();
// 1. Import the function from the Controller file
const {
  getAllMovies,
  getMoviesById,
  searchMovies,
} = require("../controllers/movieControllers");

router.get("/v1/movies", getAllMovies);
router.get("/v1/movies/search", searchMovies);
router.get("/v1/movie/:id", getMoviesById);

module.exports = router;
