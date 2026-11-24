// Util: funciones para crear y validar tokens JWT. No conocen Express (ni req ni res).
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// expiresIn limita el daño si un token se filtra: pasada 1 hora deja de servir.
export const generateToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
};

// Devuelve el payload si el token es válido; si está alterado o vencido, lanza un error.
export const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};
