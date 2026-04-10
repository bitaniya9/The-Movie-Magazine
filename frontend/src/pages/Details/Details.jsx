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
  );
};
export default Details;
