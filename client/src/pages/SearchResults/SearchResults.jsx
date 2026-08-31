import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../services/api";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await searchMovies(query);

        setMovies(data.results || []);
      } catch (error) {
        console.error("Search error:", error.message);

        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [query]);

  if (loading) {
    return <div className="loading">Searching for "{query}"...</div>;
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <h2>Search results for "{query}"</h2>

        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
