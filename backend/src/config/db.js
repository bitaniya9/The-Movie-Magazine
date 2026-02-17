const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("connection url", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo db connected successfully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to mongo db");
  }
};
module.exports = connectDB;
