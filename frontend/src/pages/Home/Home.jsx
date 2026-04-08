import React, { useState, useEffect } from "react";
import { fetchTrendingMovies } from "../../services/api"; // Path to your api.js
import { Search, Star, Play, Info } from "lucide-react";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchTrendingMovies();
      setMovies(data);
      setLoading(false);
    };
    getMovies();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  // Use the first movie for the Hero section
  const featured = movies[0] || {};

  return (
    <div className="page-container">
      <header className="hero">
        <div className="hero-overlay"></div>
        {/* Use posterImgUrl from your DB transformation! */}
        <img src={featured.posterImgUrl} alt="Featured" className="hero-img" />

        <div className="hero-content">
          <span className="badge">Featured Review</span>
          <h2 className="hero-title">{featured.title}</h2>

          <p className="hero-description">{featured.description}</p>

          {/* <div className="button-group">
            <button className="btn-primary">
              <Play size={20} fill="black" /> Watch Trailer
            </button> 
            <button className="btn-secondary">
              <Info size={20} /> Details
            </button> 
          </div> */}
        </div>
      </header>

      <main className="main-content">
        <h3>Trending Reviews</h3>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="card-image-wrapper">
                {/* Use the specific field names from your Backend transformMovie function */}
                <img src={movie.posterImgUrl} alt={movie.title} />
                <div className="rating-badge">
                  <Star size={12} fill="gold" />{" "}
                  {movie.averageRating?.toFixed(1)}
                </div>
              </div>
              <div className="card-info">
                <h4>{movie.title}</h4>
                <p>
                  {movie.releaseYear} • {movie.category?.[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <div>
        <h3>Top Rated</h3>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="card-image-wrapper">
                {/* Use the specific field names from your Backend transformMovie function */}
                <img src={movie.posterImgUrl} alt={movie.title} />
                <div className="rating-badge">
                  <Star size={12} fill="gold" />{" "}
                  {movie.averageRating?.toFixed(1)}
                </div>
              </div>
              <div className="card-info">
                <h4>{movie.title}</h4>
                <p>
                  {movie.releaseYear} • {movie.category?.[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>Series</h3>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="card-image-wrapper">
                {/* Use the specific field names from your Backend transformMovie function */}
                <img src={movie.posterImgUrl} alt={movie.title} />
                <div className="rating-badge">
                  <Star size={12} fill="gold" />{" "}
                  {movie.averageRating?.toFixed(1)}
                </div>
              </div>
              <div className="card-info">
                <h4>{movie.title}</h4>
                <p>
                  {movie.releaseYear} • {movie.category[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
