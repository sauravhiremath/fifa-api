import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const authenticated = (request, response, next) => {
  const token = request.headers.authorization;
  jwt.verify(token, config.JWT_SECRET, (error, _) => {
    if (error) {
      response.json('Token not provided');
    } else {
      next();
    }
  });
};

export const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
  } catch {
    return false;
  }
};

export default authenticated;
