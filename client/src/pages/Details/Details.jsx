import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  fetchMovieById,
  getReviews,
  postReview,
  getTmdbMovieReviews,
  getTmdbTVReviews,
  updateReview,
  deleteReview,
  fetchUserInfo,
  toggleFavorite,
  toggleWatchlist,
} from "../../services/api";
import "./Details.css";

const STAR_VALUES = [5, 4, 3, 2, 1];

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const starsFor = (rating) => "⭐".repeat(rating) + "☆".repeat(5 - rating);

const Details = () => {
  const { id } = useParams(); // it will grab the movie id from the url
  const [searchParams] = useSearchParams();
  const mediaType = searchParams.get("type") || "movie";
  const formRef = useRef(null);

  const [movie, setMovie] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [tmdbPage, setTmdbPage] = useState(1);
  const [tmdbTotalPages, setTmdbTotalPages] = useState(1);
  const [tmdbReviewsLoading, setTmdbReviewsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [myReview, setMyReview] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // const loadMovieDetail = async () => {
  //   const data = await fetchMovieById(id);
  //   setMovie(data.movie || data);
  // };

  const loadReviews = async (movieObjId, targetPage = 1, append = false) => {
    setReviewsLoading(true);
    try {
      const result = await getReviews(movieObjId, { page: targetPage });
      setReviews((prev) => (append ? [...prev, ...result.data] : result.data));
      setPage(result.page);
      setTotalPages(result.totalPages);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadTmdbReviews = async (tmdbId, targetPage = 1) => {
    setTmdbReviewsLoading(true);

    try {
      const result =
        mediaType === "tv"
          ? await getTmdbTVReviews(tmdbId, targetPage)
          : await getTmdbMovieReviews(tmdbId, targetPage);

      // Replace the reviews with the selected page
      setTmdbReviews(result.results);
      setTmdbPage(result.page);
      setTmdbTotalPages(result.total_pages);
    } catch (error) {
      console.error("Error loading TMDB reviews:", error);
    } finally {
      setTmdbReviewsLoading(false);
    }
  };

  // Checks if the logged-in user already has a review on this movie,
  // regardless of which page of the list it'd fall on.
  const checkMyReview = async (movieObjId, user) => {
    if (!user) {
      setMyReview(null);
      return;
    }
    const result = await getReviews(movieObjId, { userId: user._id });
    const existing = result.data[0] || null;
    setMyReview(existing);
    if (existing) {
      setRating(existing.rating);
      setReviewText(existing.comment || "");
    }
  };

  const loadCurrentUser = async () => {
    try {
      const payload = await fetchUserInfo();
      // adjust this line if your /users/profile response isn't wrapped in { data }
      const user = payload?.data || payload;
      setCurrentUser(user || null);
      return user || null;
    } catch {
      setCurrentUser(null);
      return null;
    }
  };

  useEffect(() => {
    if (!movie?.tmdbId) return;

    loadTmdbReviews(movie.tmdbId, 1, false);
  }, [movie?.tmdbId, mediaType]);

  
  useEffect(() => {
    if (!movie || !currentUser) {
      setIsFavorite(false);
      setInWatchlist(false);
      return;
    }

    const movieId = String(movie._id || movie.id || movie.tmdbId);

    const isSameMovie = (item) => {
      const itemId =
        typeof item === "object"
          ? item.movieId ?? item._id ?? item.id ?? item.tmdbId
          : item;

      const itemMediaType =
        typeof item === "object" ? item.mediaType : mediaType;

      return (
        String(itemId) === movieId &&
        itemMediaType === mediaType
      );
    };

    const favoriteExists =
      currentUser.favorites?.some(isSameMovie);

    const watchlistExists =
      currentUser.watchlist?.some(isSameMovie);

    setIsFavorite(!!favoriteExists);
    setInWatchlist(!!watchlistExists);
  }, [movie, currentUser, mediaType]);


  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieById(id, mediaType);
        setMovie(data.movie);
      } catch (error) {
        console.error("Error loading details:", error);
      }
    };
    loadMovie();
    loadCurrentUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mediaType]);

  // Reviews reference the movie's Mongo _id, not the tmdbId in the URL,
  // so wait until the movie itself has loaded before fetching reviews.
  useEffect(() => {
    if (!movie?._id) return;
    loadReviews(movie._id, 1, false);
    checkMyReview(movie._id, currentUser);
  }, [movie?._id, currentUser]);

  const resetForm = () => {
    setReviewText("");
    setRating("");
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setFormError("Log in to write a review.");
      return;
    }
    if (!rating) {
      setFormError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      if (myReview) {
        const updated = await updateReview(myReview._id, {
          comment: reviewText,
          rating,
        });
        setMyReview(updated.data || updated);
      } else {
        await postReview({ movieId: movie._id, comment: reviewText, rating });
        await checkMyReview(movie._id, currentUser);
      }
      await loadReviews(movie._id, 1, false);
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId);
      if (myReview?._id === reviewId) {
        setMyReview(null);
        resetForm();
      }
      await loadReviews(movie._id, 1, false);
    } catch (error) {
      alert(error.response?.data?.message || "Couldn't delete review.");
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!movie) return <div className="loading">Loading movie details...</div>;

  const handleWatchlist = async () => {
    if (!currentUser) {
      alert("Please log in to add movies to your watchlist.");
      return;
    }

    try {
      setWatchlistLoading(true);

      const result = await toggleWatchlist(movie._id);

      setInWatchlist(result.inWatchlist);

      // Update current user too
      setCurrentUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          watchlist: result.watchlist,
        };
      });
    } catch (error) {
      console.error("Watchlist error:", error);

      alert(error.response?.data?.message || "Could not update watchlist.");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) {
      alert("Please log in to add favorites.");
      return;
    }

    try {
      setFavoriteLoading(true);

      const result = await toggleFavorite(movie._id);

      setIsFavorite(result.isFavorite);

      // Update current user too
      setCurrentUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          favorites: result.favorites,
        };
      });
    } catch (error) {
      console.error("Favorite error:", error);

      alert(error.response?.data?.message || "Could not update favorites.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="main-info">
          <img src={movie.posterImgUrl} alt={movie.title} />
        </div>
        <div className="right-details">
          <h1>{movie.title}</h1>
          <div className="meta-row">
            <span>Release Year: {movie.releaseYear}</span>
            <span className="dot">.</span>
            <span>{movie.category?.join(", ")}</span>
          </div>
          <p className="description">{movie.description}</p>
          <p className="review-count"> Review Count: {movie.reviewCount}</p>
          <div className="credits">
            <p>
              <strong>Average Rating:</strong>{" "}
              {movie.averageRating
                ? `${movie.averageRating.toFixed(1)} / 10`
                : "No ratings yet"}
            </p>
          </div>
          <div className="buttons">
            <button
              className={`watchlist-btn ${inWatchlist ? "active" : ""}`}
              onClick={handleWatchlist}
              disabled={watchlistLoading}
            >
              {watchlistLoading
                ? "Updating..."
                : inWatchlist
                  ? "✓ In Watchlist"
                  : "+ Add to Watchlist"}
            </button>

            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavorite}
              disabled={favoriteLoading}
            >
              <Heart
                color="#e50914"
                fill={isFavorite ? "#e50914" : "none"}
                strokeWidth={1.5}
              />

              <span>
                {favoriteLoading
                  ? "Updating..."
                  : isFavorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Community Reviews</h2>

        <div className="tmdb-reviews-section">
          <h2>TMDB Reviews</h2>

          {tmdbReviewsLoading && tmdbReviews.length === 0 && (
            <p>Loading TMDB reviews...</p>
          )}

          {!tmdbReviewsLoading && tmdbReviews.length === 0 && (
            <p>No TMDB reviews available.</p>
          )}

          {tmdbReviews.map((review) => (
            <div className="tmdb-review-card" key={review.id}>
              <div className="tmdb-review-header">
                <h4>{review.author || "Anonymous"}</h4>

                {review.author_details?.rating != null && (
                  <span>⭐ {review.author_details.rating}/10</span>
                )}
              </div>

              <p className="review-date">{formatDate(review.created_at)}</p>

              <p>{review.content}</p>

              {review.url && (
                <a href={review.url} target="_blank" rel="noopener noreferrer">
                  Read on TMDB
                </a>
              )}
            </div>
          ))}

          {tmdbTotalPages > 1 && (
            <div className="tmdb-pagination">
              <button
                onClick={() => loadTmdbReviews(movie.tmdbId, tmdbPage - 1)}
                disabled={tmdbPage === 1 || tmdbReviewsLoading}
              >
                Previous
              </button>

              {Array.from(
                { length: tmdbTotalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={tmdbPage === pageNumber ? "active-page" : ""}
                  onClick={() => loadTmdbReviews(movie.tmdbId, pageNumber)}
                  disabled={tmdbReviewsLoading}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => loadTmdbReviews(movie.tmdbId, tmdbPage + 1)}
                disabled={tmdbPage === tmdbTotalPages || tmdbReviewsLoading}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="review-form" ref={formRef}>
          <h3>{myReview ? "Edit Your Review" : "Write a Review"}</h3>

          {!currentUser ? (
            <p className="login-prompt">Log in to write a review.</p>
          ) : (
            <>
              <select
                className="rating-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="">Select Rating</option>
                {STAR_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {"⭐".repeat(value)} ({value})
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Share your thoughts..."
                rows="5"
                className="review-textarea"
                maxLength={700}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
              <p className="char-count">{reviewText.length}/700</p>

              {formError && <p className="form-error">{formError}</p>}

              <button
                className="submit-review"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : myReview
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </>
          )}
        </div>

        {/* Existing Reviews */}
        <div className="reviews-list">
          {reviewsLoading && reviews.length === 0 && <p>Loading reviews...</p>}

          {!reviewsLoading && reviews.length === 0 && (
            <p>No reviews yet — be the first!</p>
          )}

          {reviews.map((review) => {
            const isOwner =
              currentUser &&
              (review.userId?._id || review.userId) === currentUser._id;
            return (
              <div className="review-card" key={review._id}>
                <div className="review-header">
                  <h4>
                    {isOwner ? "You" : review.userId?.name || "Anonymous"}
                  </h4>
                  <span>{starsFor(review.rating)}</span>
                </div>

                <p className="review-date">{formatDate(review.createdAt)}</p>

                <p>{review.comment}</p>

                {isOwner && (
                  <div className="review-owner-actions">
                    <button className="edit-btn" onClick={scrollToForm}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(review._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {page < totalPages && (
            <button
              className="load-more-btn"
              onClick={() => loadReviews(movie._id, page + 1, true)}
              disabled={reviewsLoading}
            >
              {reviewsLoading ? "Loading..." : "Load More Reviews"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Details;
