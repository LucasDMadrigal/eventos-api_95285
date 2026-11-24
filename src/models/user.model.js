// Model: define la forma de un usuario en MongoDB (campos, tipos y validaciones).
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, //aseguramos que llegue todo en minuscula
        trim: true //aseguramos que no haya espacios vacíos
        // podríamos agregar después una validación de formato
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    // El rol viaja dentro del token; más adelante lo usaremos para autorizar (user, organizer, admin)
    role: {
        type: String,
        enum: ["user", "organizer", "admin"],
        default: "user"
    }
});

export const userModel = model("Users", UserSchema);