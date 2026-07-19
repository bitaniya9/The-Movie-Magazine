const express = require("express");
const router = express.Router();
// 1. Import the function from the Controller file
const {
  getAllMovies,
  getMoviesById,
} = require("../controllers/movieControllers");

// 2. Define the route
// Line 5: This will now work because getAllMovies is a real function!
router.get("/v1/movies", getAllMovies);
router.get("/v1/movie/:id", getMoviesById);

module.exports = router;
