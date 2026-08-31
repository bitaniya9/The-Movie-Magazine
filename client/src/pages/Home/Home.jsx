import React, { useState, useEffect } from "react";
import { fetchMoviesByCategory } from "../../services/api";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./Home.css";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [kids, setKids] = useState([]);
  const [series, setSeries] = useState([]);
  const [discover, setDiscover] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadAllContent = async () => {
      try {
        const [trendingData, topData, kidsData, seriesData, discoverData] =
          await Promise.all([
            fetchMoviesByCategory("Trending"),
            fetchMoviesByCategory("TopRated"),
            fetchMoviesByCategory("Kids"),
            fetchMoviesByCategory("Series"),
            fetchMoviesByCategory("Discover"),
          ]);

        // The backend now returns:
        // {
        //   page,
        //   total_pages,
        //   total_results,
        //   results: [...]
        // }

        setTrending(trendingData.results || []);
        setTopRated(topData.results || []);
        setKids(kidsData.results || []);
        setSeries(seriesData.results || []);
        setDiscover(discoverData.results || []);
      } catch (error) {
        console.log("Error loading movies:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllContent();
  }, []);

  // ==========================================
  // HERO SLIDER
  // ==========================================

  useEffect(() => {
    if (trending.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === trending.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [trending]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const currentMovie = trending[currentIndex];

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page-container">
      {/* ================================
          HERO
      ================================= */}

      {currentMovie && (
        <header className="hero">
          <div className="hero-overlay"></div>

          <img
            key={currentMovie._id}
            src={currentMovie.posterImgUrl}
            alt={currentMovie.title}
            className="hero-img fade-in"
          />

          <div className="hero-content">
            <span className="badge">Featured Review</span>

            <h2 className="hero-title">{currentMovie.title}</h2>

            <p className="hero-description">{currentMovie.description}</p>
          </div>
        </header>
      )}

      <main className="main-content">
        {/* ================================
            DISCOVER
        ================================= */}

        <section className="category-section">
          <h3>Discover Movies</h3>

          <div className="movie-grid">
            {discover.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ================================
            TRENDING
        ================================= */}

        <section className="category-section">
          <h3>Trending Now</h3>

          <div className="movie-grid">
            {trending.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ================================
            TOP RATED
        ================================= */}

        <section className="category-section">
          <h3>Top Rated</h3>

          <div className="movie-grid">
            {topRated.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ================================
            SERIES
        ================================= */}

        <section className="category-section">
          <h3>Series</h3>

          <div className="movie-grid">
            {series.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ================================
            KIDS
        ================================= */}

        <section className="category-section">
          <h3>Kids & Family</h3>

          <div className="movie-grid">
            {kids.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
