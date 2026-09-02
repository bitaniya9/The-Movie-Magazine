import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { fetchMoviesByGenre, fetchMoviesByCategory } from "../../services/api";
import "./Movies.css";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-fi" },
  { id: 53, name: "Thriller" },
];

function Movies() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMovies = useCallback(
    async (pageNumber, isNewGenre = false) => {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        let data;
        if (selectedGenre) {
          data = await fetchMoviesByGenre(selectedGenre, pageNumber);
        } else {
          data = await fetchMoviesByCategory("Discover", pageNumber);
        }

        console.log("--- NETWORK TRACKER ---");
        console.log(
          `Requested Page: ${pageNumber} | Items Received:`,
          data?.results?.length,
        );

        const newMovies = data.results || [];

        setTotalPages(data.total_pages || 500);
        setpage(pageNumber);

        if (isNewGenre) {
          setMovies(newMovies);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        }
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedGenre],
  );
  useEffect(() => {
    loadMovies(1, true);
  }, [selectedGenre, loadMovies]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore) return;
      if (page >= totalPages) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 500) {
        loadMovies(page + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, loading, loadingMore, loadMovies]);

  return (
    <div className="movies-page">
      <main className="main-content">
        <h1 className="section-title">Movies</h1>
        <h2 className="browse-title">Browse by Genre</h2>

        {/* GENRE FILTERS */}
        <div className="genre-filters">
          <button
            className={!selectedGenre ? "genre-btn active" : "genre-btn"}
            onClick={() => setSelectedGenre(null)}
          >
            All
          </button>

          {genres.map((genre) => (
            <button
              key={genre.id}
              className={
                selectedGenre === genre.id ? "genre-btn active" : "genre-btn"
              }
              onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* MOVIES */}
        <section className="category-section">
          <h3>
            {selectedGenre
              ? genres.find((g) => g.id === selectedGenre)?.name
              : "All"}
          </h3>
          {loading && movies.length === 0 ? (
            <div className="loading">Loading movies...</div>
          ) : (
            <>
              <div className="movie-grid">
                {movies.length > 0 ? (
                  movies.map((movie, index) => (
                    <MovieCard
                      key={`${movie._id || movie.id}-${index}`}
                      movie={movie}
                    />
                  ))
                ) : (
                  <p className="no-movies">No movies found.</p>
                )}
              </div>
              {loadingMore && (
                <div className="loading-more">Loading more...</div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Movies;
