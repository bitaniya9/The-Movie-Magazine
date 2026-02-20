const connectDB = require("../backend/src/config/db");
require("dotenv").config();
const UserRoutes = require("./src/routes/User.routes");
const MovieRoutes = require("./src/routes/movie.routes");
const ReviewRoutes = require("./src/routes/review.routes");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", UserRoutes);
app.use("/api", MovieRoutes);
app.use("/api", ReviewRoutes);
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
