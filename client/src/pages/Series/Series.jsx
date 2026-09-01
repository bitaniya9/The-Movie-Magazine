import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { fetchMoviesByCategory } from "../../services/api";
import "./Series.css";

function Series() {
  const [series, setSeries] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadSeries = useCallback(async (pageNumber) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await fetchMoviesByCategory("Series", pageNumber);

      const newMovies = data.results || [];

      // First page
      if (pageNumber === 1) {
        setSeries(newMovies);
      } else {
        // Additional pages
        setSeries((previousMovies) => [...previousMovies, ...newMovies]);
      }

      setPage(data.page || pageNumber);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error getting series:", error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadSeries(1);
  }, [loadSeries]);

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      // Don't load if we're already loading
      if (loading || loadingMore) return;

      // Don't load beyond TMDB's available pages
      if (page >= totalPages) return;

      const scrollPosition = window.innerHeight + window.scrollY;

      const pageHeight = document.documentElement.scrollHeight;

      // Load the next page when 500px from bottom
      if (scrollPosition >= pageHeight - 500) {
        loadSeries(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages, loading, loadingMore, loadSeries]);

  if (loading) {
    return <div className="loading">Loading TV Shows...</div>;
  }

  return (
    <div className="series-page">
      <main className="main-content">
        <h2 className="section-title">TV Shows</h2>

        <div className="series-movie-grid">
          {series.length > 0 ? (
            series.map((movie) => <MovieCard key={movie._id} movie={movie} />)
          ) : (
            <p>No series found.</p>
          )}
        </div>

        {/* Loading indicator when fetching another page */}
        {loadingMore && (
          <div className="loading-more">
            <div className="spinner"></div>
            <p>Loading more TV shows...</p>
          </div>
        )}

        {/* End of results */}
        {!loadingMore && page >= totalPages && (
          <p className="end-message">You've reached the end.</p>
        )}
      </main>
    </div>
  );
}

export default Series;
