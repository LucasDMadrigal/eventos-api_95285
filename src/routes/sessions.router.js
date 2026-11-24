// Route: conecta cada URL + método HTTP con su controller (y los middlewares que corren antes).
import { Router } from "express";
import { register, login, getCurrentUser, logout, getProfile } from "../controllers/sessions.controller.js";
import { sessionErrorHandler } from "../middlewares/error.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Rutas privadas: authMiddleware corre primero y solo deja pasar si la cookie tiene un token válido
router.get("/current", authMiddleware, getCurrentUser);
router.get("/profile", authMiddleware, getProfile);

router.use(sessionErrorHandler);
export default router;
