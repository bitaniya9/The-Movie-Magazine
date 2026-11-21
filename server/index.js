
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./src/config/db");

const UserRoutes = require("./src/routes/User.routes");
const MovieRoutes = require("./src/routes/movieRoutes");
const ReviewRoutes = require("./src/routes/review.routes");
const TmdbRoutes = require("./src/routes/tmdbRoutes");

const { syncAllMovies } = require("./src/services/movieService");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://movie-review-client-six.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use("/api", UserRoutes);
app.use("/api", MovieRoutes);
app.use("/api", ReviewRoutes);
app.use("/api", TmdbRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Movie Review API is running",
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    console.log("Database connection established.");

    await syncAllMovies();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
