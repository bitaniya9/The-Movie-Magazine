import { useEffect, useState } from "react";
import { fetchMovieById } from "../../services/api";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Details.css";

const Details = () => {
  const [movie, setMovies] = useState(null);
  // const [related,setRelated]=useState([])
  //   const [loading, setLoading] = useState(false);
  const { id } = useParams(); //it will grab the movie id from the url

  useEffect(() => {
    const loadMovieDetail = async () => {
      const data = await fetchMovieById(id);
      setMovies(data.movie || data);
    };
    loadMovieDetail();
  }, [id]);
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
            <span>{movie.genre?.join(", ")}</span>
          </div>
          <p className="description">{movie.description}</p>
          <p className="review-count"> Review Count: {movie.reviewCount}</p>
          <div className="credits">
            <p>
              <strong>Director:</strong> {movie.director || "N/A"}
            </p>
            <p>
              <strong>Cast:</strong> {movie.cast?.join(", ") || "N/A"}
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
        <div className="review-form">
          <h3>Write a Review</h3>

          <input type="text" placeholder="Your Name" className="review-input" />

          <select className="rating-select">
            <option value="">Select Rating</option>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>

          <textarea
            placeholder="Share your thoughts..."
            rows="5"
            className="review-textarea"
          ></textarea>

          <button className="submit-review">Submit Review</button>
        </div>

        {/* Existing Reviews */}
        <div className="reviews-list">
          <div className="review-card">
            <div className="review-header">
              <h4>John Doe</h4>
              <span>⭐⭐⭐⭐⭐</span>
            </div>

            <p className="review-date">July 17, 2026</p>

            <p>
              Amazing movie! The visuals were stunning and the acting was
              incredible. Definitely one of my favorites.
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <h4>Sarah</h4>
              <span>⭐⭐⭐⭐</span>
            </div>

            <p className="review-date">July 10, 2026</p>

            <p>
              Really enjoyable. The pacing was a little slow in the middle, but
              the ending made up for it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Details;
