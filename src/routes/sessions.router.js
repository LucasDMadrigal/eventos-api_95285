import { Router } from "express";
import { register, login } from "../controllers/sessions.controller.js";
import { sessionErrorHandler } from "../middlewares/error.middlewares.js";
const router = Router();

// register
router.post("/register", register);
// login
router.post("/login", login);


router.use(sessionErrorHandler);
export default router;