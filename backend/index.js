import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log(error));

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
