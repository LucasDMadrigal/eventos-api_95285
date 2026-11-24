import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
}

export const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
}