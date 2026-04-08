import React, { useState, useEffect } from "react";
import { fetchMoviesByCategory } from "../../services/api";
// import { Star } from "lucide-react";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./Home.css";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [kids, setKids] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllContent = async () => {
      try {
        const [trendingData, topData, kidsData, seriesData] = await Promise.all(
          [
            fetchMoviesByCategory("Trending"),
            fetchMoviesByCategory("TopRated"),
            fetchMoviesByCategory("Kids"),
            fetchMoviesByCategory("Series"),
          ],
        );
        setTrending(trendingData);
        setTopRated(topData);
        setKids(kidsData);
        setSeries(seriesData);
      } catch (error) {
        console.log("Error loading movies:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadAllContent();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  // Use the first movie for the Hero section
  return (
    <div className="page-container">
      <header className="hero">
        <div className="hero-overlay"></div>
        {/* Use posterImgUrl from your DB transformation! */}
        <img src={trending[0]?.posterImgUrl} alt="Hero" className="hero-img" />

        <div className="hero-content">
          <span className="badge">Featured Review</span>
          <h2 className="hero-title">{trending[0]?.title}</h2>

          <p className="hero-description">{trending[0]?.description}</p>
        </div>
      </header>

      <main className="main-content">
        <section className="category-section">
          <h3>Trending Now</h3>
          <div className="movie-grid">
            {trending.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="category-section">
          <h3>Top Rated</h3>
          <div className="movie-grid">
            {topRated.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="category-section">
          <h3>Series</h3>
          <div className="movie-grid">
            {series.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

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
