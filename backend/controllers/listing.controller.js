import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const getAllListings = async (req, res, next) => {};

export const getListingById = async (req, res, next) => {};

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateListing = async (req, res, next) => {};

export const deleteListing = async (req, res, next) => {};
