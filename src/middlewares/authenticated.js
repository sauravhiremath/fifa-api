import jwt from 'jsonwebtoken';
import { API_KEY } from '../env';

const authenticated = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, API_KEY, (err, decoded) => {
        if (err) {
            res.json('Token not provided');
        } else {
            next();
        }
    });
};

export const verifyToken = token => {
    jwt.verify(token, API_KEY, (err, decoded) => {
        if (err) {
            return undefined;
        }

        return decoded;
    });
};

export default authenticated;
