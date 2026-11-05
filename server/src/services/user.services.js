const User = require("../models/User");
const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  // REGISTER
  async signUp(userData) {
    const { name, email, password } = userData;

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }

  // LOGIN
  async login(userData) {
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        userRole: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // TOGGLE FAVORITE
  async toogleFavorite(userId, movieId, mediaType = "movie") {
    return this.toggleMovieList(userId, movieId, mediaType, "favorite");
  }

  // TOGGLE WATCHLIST
  async toggleWatchList(userId, movieId, mediaType = "movie") {
    return this.toggleMovieList(userId, movieId, mediaType, "watchlist");
  }

  // SHARED FAVORITE/WATCHLIST LOGIC
  async toggleMovieList(userId, movieId, mediaType, listType) {
    if (!movieId || !["movie", "tv"].includes(mediaType)) {
      throw new Error("Valid movie ID and media type are required");
    }

    const existing = await pool.query(
      `SELECT id
       FROM user_movie_lists
       WHERE user_id = $1
       AND movie_id = $2
       AND media_type = $3
       AND list_type = $4`,
      [userId, movieId, mediaType, listType],
    );

    let isAdded;

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM user_movie_lists
         WHERE user_id = $1
         AND movie_id = $2
         AND media_type = $3
         AND list_type = $4`,
        [userId, movieId, mediaType, listType],
      );

      isAdded = false;
    } else {
      await pool.query(
        `INSERT INTO user_movie_lists
         (user_id, movie_id, media_type, list_type)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, movie_id, media_type, list_type)
         DO NOTHING`,
        [userId, movieId, mediaType, listType],
      );

      isAdded = true;
    }

    const list = await pool.query(
      `SELECT movie_id AS "movieId",
              media_type AS "mediaType"
       FROM user_movie_lists
       WHERE user_id = $1 AND list_type = $2`,
      [userId, listType],
    );

    return {
      [listType === "favorite" ? "isFavorite" : "inWatchlist"]: isAdded,
      [listType === "favorite" ? "favorites" : "watchlist"]: list.rows,
    };
  }

  // GET USER PROFILE
  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const [favorites, watchlist] = await Promise.all([
      pool.query(
        `SELECT
           m.id AS "_id",
           m.id,
           m.id AS "tmdbId",
           m.media_type AS "mediaType",
           m.title,
           m.poster_img_url AS "posterImgUrl",
           m.description,
           m.category,
           m.release_year AS "releaseYear",
           m.average_rating AS "averageRating",
           m.review_count AS "reviewCount"
         FROM user_movie_lists l
         JOIN movies m
           ON m.id = l.movie_id
           AND m.media_type = l.media_type
         WHERE l.user_id = $1 AND l.list_type = 'favorite'`,
        [userId],
      ),

      pool.query(
        `SELECT
           m.id AS "_id",
           m.id,
           m.id AS "tmdbId",
           m.media_type AS "mediaType",
           m.title,
           m.poster_img_url AS "posterImgUrl",
           m.description,
           m.category,
           m.release_year AS "releaseYear",
           m.average_rating AS "averageRating",
           m.review_count AS "reviewCount"
         FROM user_movie_lists l
         JOIN movies m
           ON m.id = l.movie_id
           AND m.media_type = l.media_type
         WHERE l.user_id = $1 AND l.list_type = 'watchlist'`,
        [userId],
      ),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      favorites: favorites.rows,
      watchlist: watchlist.rows,
    };
  }
}

module.exports = new UserService();
