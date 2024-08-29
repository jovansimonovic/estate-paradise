import "dotenv/config";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (username.length < 3 || username.length > 20) {
    return next(
      errorHandler(400, "Username must be between 3 and 20 characters")
    );
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return next(errorHandler(400, "Invalid email address"));
  }

  if (password.length < 8 || password.length > 20) {
    return next(
      errorHandler(400, "Password must be between 8 and 20 characters")
    );
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const userExists = await User.findOne({ username, email });

    if (userExists) {
      return next(errorHandler(409, "User already exists"));
    }

    await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Both fields are required"));
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return next(errorHandler(400, "Invalid email address"));
  }

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return next(errorHandler(404, "User not found"));
    }

    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (!isPasswordCorrect) {
      return next(errorHandler(401, "Invalid username or password"));
    }

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: hashedPassword, ...otherDetails } = foundUser._doc;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: otherDetails,
      token,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
