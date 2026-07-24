const Review = require("../models/Review");

class ReviewService {
  async postReview(reviewData) {
    try {
      const review = await Review.create(reviewData);
      return await review.populate("userId", "name");
    } catch (error) {
      if (error.code === 11000) {
        // unique compound index on {userId, movieId}
        throw new Error("You've already reviewed this movie");
      }
      throw error;
    }
  }

  async getReviews(page = 1, limit = 7, movieId, userId) {
    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (userId) filter.userId = userId; // was accepted but never applied before

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("userId", "name") // so the frontend can show a reviewer name
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    return {
      data: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async editReview(reviewId, reviewData, requestingUserId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.userId.toString() !== requestingUserId) {
      throw new Error("You can only edit your own review");
    }

    const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name");

    return updatedReview;
  }

  async deleteReview(reviewId, requestingUserId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.userId.toString() !== requestingUserId) {
      throw new Error("You can only delete your own review");
    }
    await Review.findByIdAndDelete(reviewId);
  }
}
module.exports = new ReviewService();
