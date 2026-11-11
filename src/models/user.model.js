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
    }
    // el campo role lo veremos más adelante
});

export const userModel = model("Users", UserSchema);