import SessionService from "../services/sessions.service.js";

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
        const user = await SessionService.login(req.body);
        res.status(200).json({ message: "success", payload: user });
    } catch (error) {
        next(error);
    }
}