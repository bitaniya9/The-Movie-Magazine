const { pool } = require("../config/db");

class ReviewService {
  // Get one review with the reviewer's name
  async getReviewWithUser(reviewId) {
    const result = await pool.query(
      `SELECT
         r.id,
         r.user_id AS "userId",
         r.movie_id AS "movieId",
         r.media_type AS "mediaType",
         r.comment,
         r.rating,
         r.created_at AS "createdAt",
         r.updated_at AS "updatedAt",
         json_build_object(
           'id', u.id,
           'name', u.name
         ) AS "reviewer"
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.id = $1`,
      [reviewId],
    );

    if (!result.rows[0]) return null;

    const review = result.rows[0];

    // Keep the old Mongoose populate-style userId response
    review.userId = review.reviewer;
    delete review.reviewer;

    return review;
  }

  // CREATE REVIEW
  async postReview(reviewData) {
    try {
      const {
        userId,
        movieId,
        mediaType = "movie",
        comment,
        rating,
      } = reviewData;

      if (!movieId || !["movie", "tv"].includes(mediaType)) {
        throw new Error("A valid movie ID and media type are required");
      }

      const result = await pool.query(
        `INSERT INTO reviews
          (user_id, movie_id, media_type, comment, rating)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [userId, movieId, mediaType, comment || null, rating],
      );

      return await this.getReviewWithUser(result.rows[0].id);
    } catch (error) {
      if (error.code === "23505") {
        throw new Error("You've already reviewed this movie");
      }
      throw error;
    }
  }

  // GET REVIEWS WITH PAGINATION
  async getReviews(page = 1, limit = 7, movieId, userId, mediaType) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.max(1, Math.min(100, Number(limit) || 7));

    const conditions = [];
    const values = [];

    if (movieId) {
      values.push(movieId);
      conditions.push(`r.movie_id = $${values.length}`);
    }

    if (userId) {
      values.push(userId);
      conditions.push(`r.user_id = $${values.length}`);
    }

    if (mediaType) {
      values.push(mediaType);
      conditions.push(`r.media_type = $${values.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM reviews r ${whereClause}`,
      values,
    );

    const total = Number(countResult.rows[0].count);
    const offset = (page - 1) * limit;

    const reviewResult = await pool.query(
      `SELECT
         r.id,
         r.movie_id AS "movieId",
         r.media_type AS "mediaType",
         r.comment,
         r.rating,
         r.created_at AS "createdAt",
         r.updated_at AS "updatedAt",
         json_build_object(
           'id', u.id,
           'name', u.name
         ) AS "userId"
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`,
      [...values, limit, offset],
    );

    return {
      data: reviewResult.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // EDIT REVIEW
  async editReview(reviewId, reviewData, requestingUserId) {
    const existing = await pool.query(
      `SELECT user_id FROM reviews WHERE id = $1`,
      [reviewId],
    );

    if (!existing.rows[0]) {
      throw new Error("Review not found");
    }

    if (existing.rows[0].user_id !== requestingUserId) {
      throw new Error("You can only edit your own review");
    }

    const { comment, rating } = reviewData;
    const updates = [];
    const values = [];

    if (comment !== undefined) {
      values.push(comment);
      updates.push(`comment = $${values.length}`);
    }

    if (rating !== undefined) {
      values.push(rating);
      updates.push(`rating = $${values.length}`);
    }

    if (updates.length === 0) {
      throw new Error("No review changes provided");
    }

    updates.push("updated_at = NOW()");
    values.push(reviewId);

    await pool.query(
      `UPDATE reviews
       SET ${updates.join(", ")}
       WHERE id = $${values.length}`,
      values,
    );

    return await this.getReviewWithUser(reviewId);
  }

  // DELETE REVIEW
  async deleteReview(reviewId, requestingUserId) {
    const existing = await pool.query(
      `SELECT user_id FROM reviews WHERE id = $1`,
      [reviewId],
    );

    if (!existing.rows[0]) {
      throw new Error("Review not found");
    }

    if (existing.rows[0].user_id !== requestingUserId) {
      throw new Error("You can only delete your own review");
    }

    await pool.query(`DELETE FROM reviews WHERE id = $1`, [reviewId]);
  }
}

module.exports = new ReviewService();
