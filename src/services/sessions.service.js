import SessionRepository from "../repositories/session.repository.js";

class SessionService {

    constructor(repository = SessionRepository) {
        this.repository = repository;
    }
    async login(userData) {
        return await this.repository.login(userData);
    }

    async register(userData) {
        return await this.repository.register(userData);
    }
}

export default new SessionService();