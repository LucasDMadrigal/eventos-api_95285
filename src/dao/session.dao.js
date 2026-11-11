import { userModel } from "../models/user.model.js";

class SessionDAO {
    async create(userData) {
        return await userModel.create(userData);
    }

    async find(email) {
        return await userModel.findOne({ email });
    }
}

export default new SessionDAO();