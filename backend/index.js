const connectDB = require("../backend/src/config/db");
require("dotenv").config();
const UserRoutes = require("./src/routes/User.routes");
const MovieRoutes = require("./src/routes/movie.routes");
const express = require("express");

const app = express();
app.use(express.json());
app.use("/api", UserRoutes);
app.use("/api", MovieRoutes);
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
