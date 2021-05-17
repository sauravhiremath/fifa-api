import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';
import { ErrorHandler, verifyToken } from '../middlewares/index.js';
import Users, { checkExisting } from '../models/usersModel.js';

const { JWT_SECRET, getExternalIp, SALT_ROUNDS } = config;

const authController = {
  login: async (request, response, next) => {
    try {
      const { username, password, reserved } = request.body;

      if (!username) {
        throw new ErrorHandler(401, 'No username found. Enter a username and try again!');
      }

      if (!reserved && username) {
        const check = await checkExisting(username);
        if (check) {
          throw new ErrorHandler(401, 'Username is already in use. Try another username or provide valid password!');
        }

        const token = jwt.sign({ username, reserved: false }, JWT_SECRET);
        return response.json({ success: true, token });
      }

      const match = await bcrypt.compare(password, user.password);
      const user = await Users.findOne({ username });

      if (user && match) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        return response.json({ success: true, token });
      }

      throw new ErrorHandler(401, 'Username or password is incorrect. Try again!');
    } catch (error) {
      next(error);
    }
  },

  register: async (request, response, next) => {
    try {
      if (!request.body) {
        throw new ErrorHandler(400, 'Invalid Request');
      }

      const { username, password } = request.body;
      const check = await checkExisting(username);

      if (check) {
        throw new ErrorHandler(400, 'Username already exists. Try another one!');
      }

      const hash = bcrypt.hashSync(password, SALT_ROUNDS);
      const newUser = new Users({ username, password: hash });

      await newUser.save();

      return response.json({
        success: true,
        message: 'Successfully registered',
      });
    } catch (error) {
      next(error);
    }
  },

  verify: (request, response) => {
    if (!request.body) {
      throw new ErrorHandler(401, 'Unauthorized user and/or route');
    }

    const { token } = request.body;
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new ErrorHandler(401, 'Unauthorized action. JWT expired');
    }

    return response.json({ success: true, decoded });
  },

  getExternalIp: async (request, response) => {
    const ip = await getExternalIp();

    return response.json({ success: true, ip });
  },
};

export default authController;
