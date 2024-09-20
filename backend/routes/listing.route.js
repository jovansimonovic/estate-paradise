import { Router } from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/jwt.js";

const router = Router();

router.get("/get-all", getAllListings);
router.get("/:id", getListingById);
router.post("/create", verifyToken, createListing);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

export default router;
