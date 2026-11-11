import SessionDao from "../dao/session.dao.js";
import { hashPassword, verifyPassword } from "../utils.js";

class SessionRepository {
    constructor(dao = SessionDao) {
        this.dao = dao;
    }
    async register(userData) {
        userData.password = await hashPassword(userData.password);
        return await this.dao.create(userData);
    }

    async login(userData) {
        const user = await this.dao.find(userData.email);
        const verify = await verifyPassword(userData.password, user.password);
        if (!verify || user == null) throw new Error("Credenciales inválidas");
        return user;
    }
}

export default new SessionRepository();