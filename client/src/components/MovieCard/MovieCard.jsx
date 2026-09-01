import "./MovieCard.css";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
const MovieCard = ({ movie }) => {
  console.log({
    _id: movie._id,
    tmdbId: movie.tmdbId,
    title: movie.title,
  });

  return (
    <Link
      to={`/movie/${movie._id}?type=${movie.mediaType || "movie"}`}
      className="movie-card-link"
    >
      <div className="movie-card">
        <div className="card-image-wrapper">
          <img src={movie.posterImgUrl} alt={movie.title} />
          <div className="rating-badge">
            <Star size={12} fill="gold" /> {movie.averageRating?.toFixed(1)}
          </div>
        </div>

        <div className="card-info">
          <h4>{movie.title || movie.name || "Untitled"}</h4>
          <p>{movie.releaseYear || movie.first_air_date}</p>
        </div>
      </div>
    </Link>
  );
};
export default MovieCard;
