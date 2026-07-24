require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const UserRoutes = require("./src/routes/User.routes");
const MovieRoutes = require("./src/routes/movieRoutes");
const ReviewRoutes = require("./src/routes/review.routes");

const cors = require("cors");
// const API_KEY = process.env.TMDB_API_KEY;
const { syncAllMovies } = require("./src/services/movieService");
// const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", UserRoutes);
app.use("/api", MovieRoutes);
app.use("/api", ReviewRoutes);

connectDB();

// // Run immediately at startup
syncAllMovies();

// // Then schedule every 6 hours
// cron.schedule("0 */6 * * *", async () => {
//   console.log("Syncing movies every 6 hours...");
//   await syncAllMovies();
// });
// console.log(API_KEY);
app.get("/", (req, res) => {
  res.json({
    message: "Movie Review API is running",
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
module.exports = app;
