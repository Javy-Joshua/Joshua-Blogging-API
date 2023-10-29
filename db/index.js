const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connect = async (url) => {
  mongoose.connect(
    url || process.env.MONGODB_URL || "mongodb://localhost:27017/Blog_db"
  );

  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred connecting to MongoDB");
  });
};

module.exports = {connect} 
