// Controller: recibe la request, valida lo mínimo, llama al service y arma la response HTTP.
import SessionService from "../services/sessions.service.js";
import { generateToken } from "../utils/jwt.utils.js";
import { config } from "../config/config.js";

// Opciones de la cookie del token. Las reutilizamos en logout: para borrarla hay que usar las mismas.
const cookieOptions = {
    httpOnly: true, // el JavaScript del navegador no puede leerla: protege el token ante ataques XSS
    secure: config.nodeEnv === "production", // en producción solo viaja por HTTPS; en desarrollo usamos HTTP
    sameSite: "lax" // no se envía en requests originadas por otros sitios (POST cross-site): ayuda contra CSRF
};

export async function register(req, res, next) {
    try {
        const newUser = await SessionService.register(req.body);
        // Nunca devolvemos el password (ni hasheado): armamos la respuesta solo con los datos públicos
        res.status(201).json({
            status: "success",
            payload: {
                id: newUser._id.toString(),
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res) {
    try {
        // 1. Leemos las credenciales del body (si no vino body, usamos un objeto vacío)
        const { email, password } = req.body ?? {};

        // 2. Faltan datos → 400: la request está mal armada, todavía no es un problema de identidad
        if (!email || !password) {
            return res.status(400).json({ status: "error", message: "Email y contraseña son obligatorios" });
        }

        // 3. Normalizamos el email igual que como se guarda en la base (minúsculas, sin espacios)
        const normalizedEmail = email.toLowerCase().trim();

        // 4. Buscamos al usuario y comparamos el password con bcrypt (service → repository)
        const user = await SessionService.login({ email: normalizedEmail, password });

        // 5. Credenciales incorrectas → 401 con el MISMO mensaje si no existe el email o si falla el password:
        //    así no le confirmamos a un atacante qué emails están registrados
        if (!user) {
            return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
        }

        // 6. Payload mínimo: solo lo necesario para identificar al usuario. Nunca el password:
        //    un JWT está firmado, no encriptado, y cualquiera puede leer su contenido
        const tokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };

        // 7. Firmamos el token (vence en 1 hora, ver jwt.utils.js)
        const token = generateToken(tokenPayload);

        // 8. Guardamos el token en una cookie HTTP Only; maxAge coincide con el vencimiento del token
        res.cookie("currentUser", token, { ...cookieOptions, maxAge: 60 * 60 * 1000 });

        // 9. Respondemos OK sin incluir el token en el body: el navegador ya lo tiene en la cookie
        return res.status(200).json({ status: "success", message: "Login correcto" });
    } catch (error) {
        // 10. Cualquier error inesperado (por ejemplo, la base caída) → 500 sin exponer detalles
        console.error("Error en login:", error);
        return res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
}

// Llega acá solo si authMiddleware validó el token: req.user ya tiene el payload decodificado
export function getCurrentUser(req, res) {
    res.status(200).json({ status: "success", payload: req.user });
}

// Para "cerrar sesión" borramos la cookie; hay que pasar las mismas opciones con que se creó
export function logout(req, res) {
    res.clearCookie("currentUser", cookieOptions);
    res.status(200).json({ status: "success", message: "Logout correcto" });
}

// Práctica M3: ejemplo de ruta privada. Cualquier ruta con authMiddleware delante queda protegida
export function getProfile(req, res) {
    res.status(200).json({ status: "success", message: "Ruta privada OK", payload: req.user });
}
