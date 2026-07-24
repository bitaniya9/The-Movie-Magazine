import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  fetchMovieById,
  getReviews,
  postReview,
  updateReview,
  deleteReview,
  fetchUserInfo,
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
  const formRef = useRef(null);

  const [movie, setMovie] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [myReview, setMyReview] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadMovieDetail = async () => {
    const data = await fetchMovieById(id);
    setMovie(data.movie || data);
  };

  const loadReviews = async (targetPage = 1, append = false) => {
    setReviewsLoading(true);
    try {
      const result = await getReviews(id, { page: targetPage });
      setReviews((prev) => (append ? [...prev, ...result.data] : result.data));
      setPage(result.page);
      setTotalPages(result.totalPages);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Checks if the logged-in user already has a review on this movie,
  // regardless of which page of the list it'd fall on.
  const checkMyReview = async (user) => {
    if (!user) {
      setMyReview(null);
      return;
    }
    const result = await getReviews(id, { userId: user._id });
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
    loadMovieDetail();
    loadReviews(1, false);
    loadCurrentUser().then(checkMyReview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        await postReview({ movieId: id, comment: reviewText, rating });
        console.log(id);
        await checkMyReview(currentUser);
      }
      await loadReviews(1, false);
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
      await loadReviews(1, false);
    } catch (error) {
      alert(error.response?.data?.message || "Couldn't delete review.");
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!movie) return <div className="loading">Loading movie details...</div>;

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
            <button className="watchlist-btn">+ Add to Watchlist</button>
            <button className="favorite-btn">
              <Heart color="#e50914" fill="red" strokeWidth={1.0} />{" "}
              <span>Add to Favorites</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>

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
              onClick={() => loadReviews(page + 1, true)}
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
