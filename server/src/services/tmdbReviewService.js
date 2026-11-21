
const { pool } = require("../config/db");
const {
  getMovieReviews,
  getTVReviews,
} = require("./tmdbService");
const { getMovieById } = require("./movieService");

// ==========================================
// FETCH AND SAVE TMDB COMMUNITY REVIEWS
// ==========================================

const fetchAndSaveReviews = async (tmdbId, mediaType = "movie", page = 1) => {
  // 1. Make sure the movie or TV show exists in PostgreSQL.
  const movie = await getMovieById(tmdbId, mediaType);

  if (!movie) {
    throw new Error("Movie or TV show not found");
  }

  // 2. Fetch reviews from TMDB.
  let data;

  if (mediaType === "tv") {
    data = await getTVReviews(tmdbId, page);
  } else {
    data = await getMovieReviews(tmdbId, page);
  }

  // 3. Save each review in PostgreSQL.
  for (const review of data.results || []) {
    const authorDetails = review.author_details || {};

    await pool.query(
      `INSERT INTO tmdb_reviews (
        tmdb_review_id,
        movie_id,
        media_type,
        author,
        author_username,
        author_avatar_path,
        rating,
        content,
        url,
        created_at_tmdb,
        updated_at_tmdb
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)

      ON CONFLICT (tmdb_review_id)
      DO UPDATE SET
        author = EXCLUDED.author,
        author_username = EXCLUDED.author_username,
        author_avatar_path = EXCLUDED.author_avatar_path,
        rating = EXCLUDED.rating,
        content = EXCLUDED.content,
        url = EXCLUDED.url,
        updated_at_tmdb = EXCLUDED.updated_at_tmdb,
        updated_at = NOW()`,
      [
        review.id,
        tmdbId,
        mediaType,
        review.author || null,
        authorDetails.username || null,
        authorDetails.avatar_path || null,
        authorDetails.rating ?? null,
        review.content || null,
        review.url || null,
        review.created_at || null,
        review.updated_at || null,
      ],
    );
  }

  // 4. Return TMDB's original response format.
  return data;
};

// ==========================================
// PUBLIC METHODS
// ==========================================

const getMovieReviewsFromTMDB = async (tmdbId, page = 1) => {
  return fetchAndSaveReviews(tmdbId, "movie", page);
};

const getTVReviewsFromTMDB = async (tmdbId, page = 1) => {
  return fetchAndSaveReviews(tmdbId, "tv", page);
};

module.exports = {
  getMovieReviewsFromTMDB,
  getTVReviewsFromTMDB,
};
