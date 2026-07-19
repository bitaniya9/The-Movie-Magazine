require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const UserRoutes = require("./src/routes/User.routes");
const MovieRoutes = require("./src/routes/movieRoutes");
const ReviewRoutes = require("./src/routes/review.routes");

const { syncAllMovies } = require("./src/services/movieService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Movie Review API is running" });
});

app.use("/api", UserRoutes);
app.use("/api", MovieRoutes);
app.use("/api", ReviewRoutes);

connectDB();

if (process.env.NODE_ENV !== "production") {
  syncAllMovies();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
