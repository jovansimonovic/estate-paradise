import { Schema, model } from "mongoose";

const listingSchema = new Schema({}, { timestamps: true });

export default model("Listing", listingSchema);
