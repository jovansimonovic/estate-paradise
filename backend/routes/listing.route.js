import { Router } from "express";
import {
  getAllListings,
  getListingsById,
  getOneListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/jwt.js";

const router = Router();

router.get("/get-all", getAllListings);
router.get("/get-all-by-id", verifyToken, getListingsById);
router.get("/get-one/:id", getOneListing);
router.post("/create", verifyToken, createListing);
router.put("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
