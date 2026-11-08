import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log("Conexión a la base de datos establecida");
    }
    catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}