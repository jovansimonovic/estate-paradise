import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();

    return res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getListingsById = async (req, res, next) => {
  try {
    const foundListings = await Listing.find({ createdBy: req.user.id });

    if (foundListings.length === 0) {
      return res.status(404).json({
        message: "No listings found",
      });
    }

    return res.status(200).json({
      success: true,
      listings: foundListings,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getOneListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const createListing = async (req, res, next) => {
  const bedrooms = Number(req.body.bedrooms);
  const bathrooms = Number(req.body.bathrooms);
  const regularPrice = Number(req.body.regularPrice);
  const discountPrice = Number(req.body.discountPrice);

  if (req.body.name.length < 10 || req.body.name.length > 50) {
    return next(errorHandler(400, "Name must be between 10 and 50 characters"));
  }

  if (req.body.description.length < 10 || req.body.description.length > 300) {
    return next(
      errorHandler(400, "Description must be between 10 and 300 characters")
    );
  }

  if (req.body.address.length < 10 || req.body.address.length > 50) {
    return next(
      errorHandler(400, "Address must be between 10 and 50 characters")
    );
  }

  if (!req.body.type) {
    return next(errorHandler(400, "Select a listing type"));
  }
  if (req.body.type && req.body.type !== "sale" && req.body.type !== "rent") {
    return next(
      errorHandler(400, "Listing type must be either 'sale' or 'rent'")
    );
  }

  if (typeof req.body.hasParking !== "boolean") {
    return next(errorHandler(400, "hasParking must be a boolean"));
  }

  if (typeof req.body.isFurnished !== "boolean") {
    return next(errorHandler(400, "isFurnished must be a boolean"));
  }

  if (typeof req.body.isOffered !== "boolean") {
    return next(errorHandler(400, "isOffered must be a boolean"));
  }

  if (bedrooms < 1 || bedrooms > 100) {
    return next(errorHandler(400, "Bedrooms must be between 1 and 100"));
  }

  if (bathrooms < 1 || bathrooms > 100) {
    return next(errorHandler(400, "Bathrooms must be between 1 and 100"));
  }

  if (regularPrice < 1 || regularPrice > 100000000) {
    return next(
      errorHandler(400, "Regular price must be between 1 and 100,000,000")
    );
  }

  if (discountPrice > 100000000) {
    return next(
      errorHandler(400, "Discount price must be less than 100,000,000")
    );
  }

  if (regularPrice <= discountPrice) {
    return next(
      errorHandler(400, "Discount price must be less than regular price")
    );
  }

  if (req.body.images.length < 1) {
    return next(errorHandler(400, "At least 1 image must be uploaded"));
  }

  req.body.images.forEach((image) => {
    const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!regex.test(image)) {
      return next(errorHandler(400, "Invalid image URL"));
    }
  });

  try {
    const newListing = await Listing.create({
      ...req.body,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (listing.createdBy.toString() !== req.user.id) {
    return next(errorHandler(403, "You can only update your own listings"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
        $inc: { __v: 1 },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
