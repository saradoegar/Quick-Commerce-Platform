const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be configured before starting the API");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
};

module.exports = connectDatabase;
