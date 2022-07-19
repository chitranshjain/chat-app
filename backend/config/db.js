const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if (connection) {
      console.log(
        `Successfully connected to the Database. HOST : ${connection.connection.host}`
      );
    }
  } catch (error) {
    console.log(
      `Error while connecting to the database. ERROR : ${error.message}`
    );
  }
};

module.exports = { connectDB };
