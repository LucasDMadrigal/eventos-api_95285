export const config = {
    port : process.env.PORT || 3000,
    mongoUrl : process.env.MONGO_URL || "mongodb://localhost:27017/eventos-api-95285",
    jwtSecret : process.env.JWT_SECRET || "nada",
    nodeEnv : process.env.NODE_ENV || "development" // Http para desarrollo y https para producción
}