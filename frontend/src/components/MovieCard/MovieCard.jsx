import "./MovieCard.css";
import { Star } from "lucide-react";
const MovieCard = ({ movie }) => (
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
);

export default MovieCard;
