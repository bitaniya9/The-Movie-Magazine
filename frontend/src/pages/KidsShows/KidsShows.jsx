import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { fetchMoviesByCategory } from "../../services/api";
import "./KidsShows.css";
function KidsShows() {
  const [kidsShows, setKidsShow] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKidsShows = async () => {
      try {
        const data = await fetchMoviesByCategory("Kids");
        setKidsShow(data);
      } catch (error) {
        console.log("Error loading movies:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadKidsShows();
  }, []);
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <main className="main-content">
        <h2 className="section-title">Kids & Family Shows</h2>
        <div className="movie-grid">
          {kidsShows.length > 0 ? (
            kidsShows.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p>No kids shows found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default KidsShows;
