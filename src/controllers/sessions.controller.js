import SessionService from "../services/sessions.service.js";
import { generateToken } from "../utils/jwt.utils.js";

export async function register(req, res, next) {
    try {
        const newUser = await SessionService.register(req.body);
        res.status(201).json({ message: "success", payload: newUser });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await SessionService.login({ email: normalizedEmail, password });

        if (!user){
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }
        
        const tokenUser = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = generateToken(tokenUser);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // https en producción, http en desarrollo
            sameSite: "lax", // para prevenir CSRF
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        console.log("Token", res); // Log del token generado
        res.status(200).json({ status: "success", message: "Login successful" });
        // res.status(200).json({ status: "success", message: "Login successful", token });
    } catch (error) {
        next(error);
    }
}

export async function currentUser(req, res, next) {
    res.status(200).json({ status: "success", payload: req.user });
}
