import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

// connects to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log(error));

const app = express();

// middleware to parse JSON request bodies
app.use(express.json());

// cors configuration
app.use(cors({ origin: "*" }));

// routers
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
