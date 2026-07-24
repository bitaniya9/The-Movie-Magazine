const ReviewServices = require("../services/review.services");

class ReviewControllers {
  async postReview(request, response) {
    try {
      const userId = request.user.userId || request.user.id || request.user._id;
      const reviewData = { ...request.body, userId };
      const newReview = await ReviewServices.postReview(reviewData);
      response.status(201).json({ success: true, data: newReview });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }

  async getReview(request, response) {
    try {
      const { page = 1, limit = 7, movieId, userId } = request.query;
      const reviews = await ReviewServices.getReviews(
        Number(page),
        Number(limit),
        movieId,
        userId,
      );
      response.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  }

  async updateReview(request, response) {
    try {
      const userId = request.user.userId || request.user.id || request.user._id;
      const updatedReview = await ReviewServices.editReview(
        request.params.id,
        request.body,
        userId,
      );
      response.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }

  async deleteReview(request, response) {
    try {
      const userId = request.user.userId || request.user.id || request.user._id;
      await ReviewServices.deleteReview(request.params.id, userId);
      response.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      response.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ReviewControllers();
