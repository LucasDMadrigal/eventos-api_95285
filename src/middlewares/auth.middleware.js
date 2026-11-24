import { verifyToken } from '../utils/jwt.utils.js';

export const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}