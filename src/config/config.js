// Config: único lugar donde se leen las variables de entorno. El resto de la app importa `config`.

// Sin secreto no se pueden firmar tokens seguros: preferimos que la app no arranque a usar un valor conocido.
if (!process.env.JWT_SECRET) {
    throw new Error("Falta la variable de entorno JWT_SECRET (ver .env.example)");
}

export const config = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/eventos-api-95285",
    jwtSecret: process.env.JWT_SECRET,
    // "production" activa cookies `secure` (solo viajan por HTTPS); en desarrollo usamos HTTP
    nodeEnv: process.env.NODE_ENV || "development"
};
