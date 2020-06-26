import jwt from 'jsonwebtoken';
import { API_KEY } from '../env';
import { ErrorHandler } from './';

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
        throw new ErrorHandler(401, 'Invalid token or unauthorized operation. Sign in again!');
    }
};

export default authenticated;
