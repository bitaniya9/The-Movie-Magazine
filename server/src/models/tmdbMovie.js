const mongoose = require("mongoose");

const TmdbReviewSchema = new mongoose.Schema(
  {
    tmdbReviewId: {
      type: String,
      required: true,
      unique: true,
    },

    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    tmdbMovieId: {
      type: Number,
      required: true,
    },

    author: {
      type: String,
    },

    authorUsername: {
      type: String,
    },

    authorAvatarPath: {
      type: String,
    },

    rating: {
      type: Number,
      default: null,
    },

    content: {
      type: String,
    },

    url: {
      type: String,
    },

    createdAtTmdb: {
      type: Date,
    },

    updatedAtTmdb: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("TmdbReview", TmdbReviewSchema);
