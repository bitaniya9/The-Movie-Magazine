
const tmdbReviewService = require("../services/tmdbReviewService");

class TmdbController {
  async getMovieReviews(request, response) {
    try {
      const { tmdbId } = request.params;
      const page = Number(request.query.page) || 1;

      const reviews =
        await tmdbReviewService.getMovieReviewsFromTMDB(tmdbId, page);

      response.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching TMDB movie reviews:", error);

      response.status(500).json({
        message: "Failed to fetch TMDB movie reviews",
      });
    }
  }

  async getTVReviews(request, response) {
    try {
      const { tmdbId } = request.params;
      const page = Number(request.query.page) || 1;

      const reviews =
        await tmdbReviewService.getTVReviewsFromTMDB(tmdbId, page);

      response.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching TMDB TV reviews:", error);

      response.status(500).json({
        message: "Failed to fetch TMDB TV reviews",
      });
    }
  }
}

module.exports = new TmdbController();
