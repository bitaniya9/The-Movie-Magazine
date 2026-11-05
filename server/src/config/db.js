const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("Could not connect to PostgreSQL:", error.message);
    throw error;
  }
};

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = { pool, connectDB };
