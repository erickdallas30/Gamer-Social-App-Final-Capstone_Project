//connection to DB
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const connection = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/gameup_socialapp");

    console.log("Successfully connected to database: gameup_socialapp");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to the database!!");
  }
};

module.exports = connection;
