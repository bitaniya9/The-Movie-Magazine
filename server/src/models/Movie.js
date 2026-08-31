const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  posterImgUrl: {
    type: String,
  },

  description: {
    type: String,
  },

  category: {
    type: [String],
    enum: [
      "Trending",
      "Popular",
      "Top Rated",
      "Kids",
      "Series",
      "Discover",
      "Search",
      "Classics",
      "General",
    ],
  },

  releaseYear: {
    type: String,
  },

  averageRating: {
    type: Number,
    default: 0,
  },

  reviewCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
