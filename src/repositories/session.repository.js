// Repository: arma las operaciones de sesión (hashear, comparar) sobre el DAO, que es quien habla con MongoDB.
import SessionDao from "../dao/session.dao.js";
import { hashPassword, verifyPassword } from "../utils/hash.utils.js";

class SessionRepository {
    constructor(dao = SessionDao) {
        this.dao = dao;
    }
    async register(userData) {
        userData.password = await hashPassword(userData.password);
        return await this.dao.create(userData);
    }

    // Devuelve el usuario si las credenciales son correctas, o null si no lo son.
    // Que no lance un error permite que el controller responda 401 (y no 409 desde el error handler).
    async login(userData) {
        const user = await this.dao.find(userData.email);
        if (!user) return null;
        const isValid = await verifyPassword(userData.password, user.password);
        if (!isValid) return null;
        return user;
    }
}

export default new SessionRepository();
