const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));
};

module.exports = connectDB;
