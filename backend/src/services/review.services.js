const Review = require("../models/Review");

class ReviewService {
  async postReview(reviewData) {
    return await Review.create(reviewData);
  }
  async getReviews(page = 1, limit = 7, movieId, userId) {
    const skip = (page - 1) * limit;
    const filter = {};
    if (movieId) {
      filter.movieId = movieId;
    }
    if (userId) {
      filter.userId = userId;
    }
    const reviews = await Review.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Review.countDocuments(filter);
    return {
      total,
      page,
      pages: Math.ceil(total / limit),
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
