const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: {
    type: [String],
    enum: [
      "comedy",
      "action",
      "romance",
      "drama",
      "documentary",
      "family",
      "adventure",
      "sci-fi",
      "horror",
      "thriller",
    ],

    required: true,
  },
  posterImgUrl: { type: String },

  description: { type: String },

  director: { type: String, required: true },

  cast: [{ name: { type: String, required: true }, role: { type: String } }],
  category: {
    type: [String],
    enum: [
      "Trending",
      "Family",
      "Popular",
      "Kids",
      "Adventure",
      "Classics",
      "Comedy",
    ],
  },
  releaseYear: { type: Number, required: true },

  averageRating: { type: Number, default: 0 },

  reviewCount: { type: Number, default: 0 },
});
module.exports = mongoose.model("Movie", MovieSchema);
