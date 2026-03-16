const Movie = require("../models/Movie");

class MovieServices {
  async createMovie(movieData) {
    return await Movie.create(movieData);
  }
  async getAllMovies(page = 1, limit = 10, search, genres) {
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (genres) {
      const genreArray = genres.split(",").map((g) => g.trim());
      filter.genre = { $in: genreArray };
    }
    const movies = await Movie.find(filter).skip(skip).limit(limit);

    const total = await Movie.countDocuments(filter);
    return {
      total,
      page,
      pages: Math.ceil(total / limit),
      data: movies,
    };
  }
  async updateMovie(movieId, movieData) {
    return await Movie.findByIdAndUpdate(movieId, movieData, {
      new: true,
      runValidators: true,
    });
  }
  async getMoviesByCategory(category) {
    return await Movie.find({ category: category });
  }
  async deleteMovie(movieId) {
    return await Movie.findByIdAndDelete(movieId);
  }
}
module.exports = new MovieServices();
