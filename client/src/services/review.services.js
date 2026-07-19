const Review = require("../models/Review");

class ReviewService {
  async postReview(reviewData) {
    return await Review.create(reviewData);
  }
  async getReviews(page = 1, limit = 7, movieId, userId) {
    console.log("movieId:", movieId);
    console.log("userId:", userId);

    const filter = {};

    if (movieId) {
      filter.movieId = movieId;
    }

    console.log("filter:", filter);

    const reviews = await Review.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      data: reviews,
    };
  }
  async editReview(reviewId, reviewData) {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, {
      new: true,
      runValidators: true,
    });
    if (!updatedReview) {
      throw new Error("Review not found");
    }
    return updatedReview;
  }
  async deleteReview(reviewId) {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      throw new Error("Review not found");
    }
  }
}
module.exports = new ReviewService();
