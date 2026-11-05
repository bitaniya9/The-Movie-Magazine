const { pool } = require("../config/db");

const {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchMovieDetails,
  fetchTVDetails,
  discoverMovies,
  searchMovies: searchMoviesFromTMDB,
} = require("./tmdbService");

// ==========================================
// TRANSFORM TMDB MOVIE / TV DATA
// ==========================================

const transformMovie = (movie, categoryName, mediaType = "movie") => ({
  tmdbId: movie.id,
  mediaType,
  title: movie.title || movie.name || "Untitled",

  posterImgUrl: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null,

  description: movie.overview || "",
  category: [categoryName],

  releaseYear:
    movie.release_date || movie.first_air_date
      ? String(
          new Date(movie.release_date || movie.first_air_date).getFullYear(),
        )
      : "N/A",

  averageRating: movie.vote_average || 0,
  reviewCount: movie.vote_count || 0,
});

// ==========================================
// FORMAT DATABASE MOVIE
// ==========================================

const formatMovie = (movie) => ({
  _id: Number(movie.id),
  tmdbId: Number(movie.id),
  mediaType: movie.media_type,
  title: movie.title,
  posterImgUrl: movie.poster_img_url,
  description: movie.description,
  category: movie.category,
  releaseYear: movie.release_year,
  averageRating: movie.average_rating,
  reviewCount: movie.review_count,
});

// ==========================================
// SAVE MOVIES TO POSTGRESQL
// ==========================================

const saveMovies = async (movies) => {
  const savedMovies = [];

  for (const movie of movies) {
    const result = await pool.query(
      `INSERT INTO movies (
        id,
        media_type,
        title,
        poster_img_url,
        description,
        category,
        release_year,
        average_rating,
        review_count
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id, media_type)
      DO UPDATE SET
        title = EXCLUDED.title,
        poster_img_url = EXCLUDED.poster_img_url,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        release_year = EXCLUDED.release_year,
        average_rating = EXCLUDED.average_rating,
        review_count = EXCLUDED.review_count
      RETURNING *`,
      [
        movie.tmdbId,
        movie.mediaType,
        movie.title,
        movie.posterImgUrl,
        movie.description,
        movie.category,
        movie.releaseYear,
        movie.averageRating,
        movie.reviewCount,
      ],
    );

    savedMovies.push(formatMovie(result.rows[0]));
  }

  return savedMovies;
};

// ==========================================
// SYNC CATEGORY
// ==========================================

const syncCategory = async (
  fetchFunction,
  categoryName,
  pages = 1,
  mediaType = "movie",
) => {
  const allMovies = [];

  for (let page = 1; page <= pages; page++) {
    const data = await fetchFunction(page);

    if (data && data.results) {
      allMovies.push(...data.results);
    }
  }

  const transformedMovies = allMovies.map((movie) =>
    transformMovie(movie, categoryName, mediaType),
  );

  return saveMovies(transformedMovies);
};

// ==========================================
// SYNC ALL MOVIES
// ==========================================

const syncAllMovies = async () => {
  try {
    await syncCategory(fetchPopularMovies, "Popular", 5, "movie");
    await syncCategory(fetchTopRatedMovies, "Top Rated", 5, "movie");
    await syncCategory(fetchTrendingMovies, "Trending", 1, "movie");

    console.log("All movies synced successfully.");
  } catch (error) {
    console.error("Sync failed:", error);
  }
};

// ==========================================
// GET MOVIES
// ==========================================

const getMovies = async (filter = {}) => {
  const conditions = [];
  const values = [];

  if (filter.mediaType) {
    values.push(filter.mediaType);
    conditions.push(`media_type = $${values.length}`);
  }

  if (filter.category) {
    values.push(filter.category);
    conditions.push(`$${values.length} = ANY(category)`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `SELECT * FROM movies ${whereClause} ORDER BY title`,
    values,
  );

  return result.rows.map(formatMovie);
};

// ==========================================
// DISCOVER MOVIES
// ==========================================

const getDiscoverMovies = async (page = 1) => {
  const data = await discoverMovies(page);

  const transformedMovies = (data.results || []).map((movie) =>
    transformMovie(movie, "Discover", "movie"),
  );

  const savedMovies = await saveMovies(transformedMovies);

  return {
    page: data.page,
    results: savedMovies,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

// ==========================================
// SEARCH
// ==========================================

const searchMovies = async (query, page = 1) => {
  if (!query || !query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const data = await searchMoviesFromTMDB(query.trim(), page);

  const transformedMovies = (data.results || [])
    .filter(
      (movie) => movie.media_type === "movie" || movie.media_type === "tv",
    )
    .map((movie) =>
      transformMovie(
        movie,
        movie.media_type === "tv" ? "Series" : "Search",
        movie.media_type,
      ),
    );

  const savedMovies = await saveMovies(transformedMovies);

  return {
    page: data.page,
    results: savedMovies,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

// ==========================================
// GET MOVIE / TV DETAILS
// ==========================================

const getMovieById = async (tmdbId, mediaType = "movie") => {
  try {
    console.log("Getting details:", tmdbId, "Type:", mediaType);

    // Check PostgreSQL first.
    const existing = await pool.query(
      `SELECT * FROM movies
       WHERE id = $1 AND media_type = $2`,
      [tmdbId, mediaType],
    );

    if (existing.rows.length > 0) {
      console.log("Found in PostgreSQL");
      return formatMovie(existing.rows[0]);
    }

    // Fetch details from TMDB if not found.
    let raw;

    if (mediaType === "tv") {
      console.log("Fetching TV details from TMDB...");
      raw = await fetchTVDetails(tmdbId);
    } else {
      console.log("Fetching movie details from TMDB...");
      raw = await fetchMovieDetails(tmdbId);
    }

    if (!raw || !raw.id) {
      console.log("TMDB returned no result");
      return null;
    }

    const transformed = transformMovie(
      raw,
      mediaType === "tv" ? "Series" : "General",
      mediaType,
    );

    const saved = await saveMovies([transformed]);

    console.log("Details saved to PostgreSQL");

    return saved[0];
  } catch (error) {
    console.error("getMovieById error:", error);
    throw error;
  }
};

module.exports = {
  syncAllMovies,
  getMovies,
  getDiscoverMovies,
  searchMovies,
  getMovieById,
  transformMovie,
  saveMovies,
};
