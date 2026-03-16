const MovieServices = require("../services/movie.services");

class MovieController {
  async createMovie(request, response) {
    try {
      const movie = await MovieServices.createMovie(request.body);
      response.status(201).json({ success: true, data: movie });
    } catch (error) {
      response.status(400).json({ success: false, message: error.message });
    }
  }
  async getAllMovies(request, response) {
    try {
      const { page = 1, limit = 10, search, genres } = request.query;
      const movies = await MovieServices.getAllMovies(
        Number(page),
        Number(limit),
        search,
        genres,
      );
      response.status(200).json({ success: true, data: movies });
    } catch (error) {
      response.status(500).json({ success: false, message: error.message });
    }
  }
  async updateMovie(request, response) {
    try {
      const updatedmovie = await MovieServices.updateMovie(
        request.params.id,
        request.body,
      );
      response.status(200).json({ success: true, data: updatedmovie });
    } catch (error) {
      response.status(403).json({ success: false, message: error.message });
    }
  }
  async getMoviesByCategory(request, response) {
    try {
      const movies = await MovieServices.getMoviesByCategory(
        request.params.category,
      );
      response.status(200).json({ success: true, data: movies });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
  async deleteMovie(request, response) {
    try {
      await MovieServices.deleteMovie(request.params.id);
      response.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      response.status(500).json({ success: false, message: error.message });
    }
  }
}
module.exports = new MovieController();
