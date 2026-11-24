// Middleware: se ejecuta ANTES del controller y decide si la request puede seguir (usuario autenticado).
import { verifyToken } from "../utils/jwt.utils.js";

export const authMiddleware = (req, res, next) => {
    // req.cookies existe gracias a cookie-parser (configurado en app.js)
    const token = req.cookies.currentUser;
    if (!token) {
        return res.status(401).json({ status: "error", message: "No autenticado" });
    }

    try {
        // Si el token es válido, dejamos el payload en req.user para que lo usen los siguientes handlers
        req.user = verifyToken(token);
        // next() pasa el control al siguiente middleware/controller; sin él la request queda colgada
        next();
    } catch (error) {
        // verifyToken lanza un error si el token fue alterado o ya venció
        return res.status(401).json({ status: "error", message: "Token inválido o expirado" });
    }
};
