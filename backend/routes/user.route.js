import { Router } from "express";
import { update } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/jwt.js";

const router = Router();

router.post("/update/:id", verifyToken, update);

export default router;
