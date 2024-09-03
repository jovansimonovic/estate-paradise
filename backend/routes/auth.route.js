import { Router } from "express";
import { googleAuth, login, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/googleAuth", googleAuth)

export default router;
