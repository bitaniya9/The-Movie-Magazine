import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Star } from "lucide-react";
import { fetchMoviesByCategory } from "../../services/api";

function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadSeries = async () => {
      try {
        const data = await fetchMoviesByCategory("Series");
        setSeries(data);
      } catch (error) {
        console.log("Error getting series:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadSeries();
  }, []);
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <main className="main-content">
        <h2 className="section-title">TV Shows</h2>
        <div className="movie-grid">
          {series.length > 0 ? (
            series.map((movie) => <MovieCard key={movie._id} movie={movie} />)
          ) : (
            <p>No series found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Series;
