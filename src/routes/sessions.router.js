import { Router } from "express";
import { register, login, currentUser } from "../controllers/sessions.controller.js";
import { sessionErrorHandler } from "../middlewares/error.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

// register
router.post("/register", register);
// login
router.post("/login", login);
// get current user
router.get("/current", authMiddleware, currentUser);

router.use(sessionErrorHandler);
export default router;