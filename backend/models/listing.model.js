import { Schema, model } from "mongoose";

const listingSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    isFurnished: { type: Boolean, required: true },
    hasParking: { type: Boolean, required: true },
    type: { type: String, enum: ["rent", "sale"], required: true },
    isOffered: { type: Boolean, required: true },
    images: { type: [String], required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Listing", listingSchema);
