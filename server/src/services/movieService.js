const Movie = require("../models/Movie");

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
  title: movie.title || movie.name || "Untitled",

  posterImgUrl: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined,

  description: movie.overview || "",

  category: [categoryName],

  releaseYear:
    movie.release_date || movie.first_air_date
      ? new Date(movie.release_date || movie.first_air_date).getFullYear()
      : "N/A",

  averageRating: movie.vote_average || 0,

  reviewCount: movie.vote_count || 0,

  tmdbId: movie.id,

  mediaType: mediaType,
});

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

  const savePromises = transformedMovies.map(async (movie) => {
    return await Movie.findOneAndUpdate(
      {
        tmdbId: movie.tmdbId,
      },
      {
        $set: movie,
      },
      {
        upsert: true,
        new: true,
      },
    );
  });

  return Promise.all(savePromises);
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
  return await Movie.find(filter);
};

// ==========================================
// DISCOVER MOVIES
// ==========================================

const getDiscoverMovies = async (page = 1) => {
  const data = await discoverMovies(page);

  const transformedMovies = data.results.map((movie) =>
    transformMovie(movie, "Discover", "movie"),
  );

  return {
    page: data.page,
    results: transformedMovies,
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

  return {
    page: data.page,
    results: transformedMovies,
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

    // ------------------------------------------
    // IMPORTANT:
    // Find by BOTH tmdbId AND mediaType
    // ------------------------------------------

    let movie = await Movie.findOne({
      tmdbId,
      mediaType,
    });

    if (movie) {
      console.log("Found in MongoDB");

      return movie;
    }

    // ------------------------------------------
    // Fetch from TMDB
    // ------------------------------------------

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

    // ------------------------------------------
    // Transform
    // ------------------------------------------

    const transformed = transformMovie(
      raw,
      mediaType === "tv" ? "Series" : "General",
      mediaType,
    );

    // ------------------------------------------
    // Save to MongoDB
    // ------------------------------------------

    movie = await Movie.findOneAndUpdate(
      {
        tmdbId: raw.id,
        mediaType,
      },
      {
        $set: transformed,
      },
      {
        upsert: true,
        new: true,
      },
    );

    console.log("Details saved to MongoDB");

    return movie;
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
};
