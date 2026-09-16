const express = require("express");
const TmdbController = require("../controllers/tmdbControllers");

const router = express.Router();

router.get("/v1/tmdb-reviews/movie/:tmdbId", TmdbController.getMovieReviews);

router.get("/v1/tmdb-reviews/tv/:tmdbId", TmdbController.getTVReviews);

module.exports = router;
