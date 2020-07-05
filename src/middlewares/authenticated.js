import jwt from 'jsonwebtoken';
import { API_KEY } from '../env';

const authenticated = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, API_KEY, (err, _) => {
        if (err) {
            res.json('Token not provided');
        } else {
            next();
        }
    });
};

export const verifyToken = token => {
    try {
        const decoded = jwt.verify(token, API_KEY);
        return decoded;
    } catch {
        return false;
    }
};

export default authenticated;
