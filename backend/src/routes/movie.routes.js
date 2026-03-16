const MovieController = require("../controllers/movie.controller");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
router.post(
  "/v1/movies",
  authMiddleware,
  adminMiddleware,
  MovieController.createMovie,
);
router.get("/v1/movies", MovieController.getAllMovies);
router.get("/v1/movies/:category", MovieController.getMoviesByCategory);
router.put(
  "/v1/movies/:id",
  authMiddleware,
  adminMiddleware,
  MovieController.updateMovie,
);
router.delete(
  "/v1/movies/:id",
  authMiddleware,
  adminMiddleware,
  MovieController.deleteMovie,
);

module.exports = router;
