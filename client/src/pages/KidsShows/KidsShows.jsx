import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { fetchMoviesByCategory } from "../../services/api";
import "./KidsShows.css";

function KidsShows() {
  const [kidsShows, setKidsShows] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // ==========================================
  // LOAD KIDS MOVIES
  // ==========================================

  const loadKidsShows = useCallback(async (pageNumber) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await fetchMoviesByCategory("Kids", pageNumber);

      const newMovies = data.results || [];

      // First page
      if (pageNumber === 1) {
        setKidsShows(newMovies);
      } else {
        // Add the next page to the existing movies
        setKidsShows((previousMovies) => {
          const combined = [...previousMovies, ...newMovies];

          const uniqueMovies = combined.filter(
            (movie, index, self) =>
              index === self.findIndex((m) => m._id === movie._id),
          );

          return uniqueMovies;
        });
      }

      setPage(data.page || pageNumber);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error getting kids shows:", error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadKidsShows(1);
  }, [loadKidsShows]);

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      // Don't load while another request is running
      if (loading || loadingMore) return;

      // Don't request pages beyond TMDB's available pages
      if (page >= totalPages) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      // Start loading 500px before reaching the bottom
      if (scrollPosition >= pageHeight - 500) {
        loadKidsShows(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages, loading, loadingMore, loadKidsShows]);

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (loading) {
    return <div className="loading">Loading Kids & Family Shows...</div>;
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="kids-page">
      <main className="main-content">
        <h2 className="section-title">Kids & Family</h2>

        <div className="kids-movie-grid">
          {kidsShows.length > 0 ? (
            kidsShows.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p>No kids shows found.</p>
          )}
        </div>

        {/* ==========================================
            LOADING MORE
        ========================================== */}

        {loadingMore && (
          <div className="loading-more">
            <div className="spinner"></div>
            <p>Loading more kids movies...</p>
          </div>
        )}

        {/* ==========================================
            END OF RESULTS
        ========================================== */}

        {!loadingMore && page >= totalPages && kidsShows.length > 0 && (
          <p className="end-message">You've reached the end.</p>
        )}
      </main>
    </div>
  );
}

export default KidsShows;
