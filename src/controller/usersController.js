import usersModel from '../models/usersModel.js';

const usersController = {
  getAll: async (request, response, _) => {
    usersModel.find({}, (error, users) => {
      if (error) {
        return response.json(error);
      }

      response.json(users);
    });
  },

  getOne: (request, response, _) => {
    usersModel.findById(request.params.id, (error, user) => {
      if (error) {
        return response.json(error);
      }

      response.json(user || {});
    });
  },

  create: (request, response, _) => {
    usersModel.create(request.body, (error, user) => {
      if (error) {
        return response.json(error);
      }

      response.json(user);
    });
  },

  update: (request, response, _) => {
    usersModel.findOneAndUpdate(request.params.id, request.body, { new: true }, (error, user) => {
      if (error) {
        return response.json(error);
      }

      response.json(user);
    });
  },

  delete: (request, response, _) => {
    usersModel.remove({ _id: request.params.id }, (error, _) => {
      if (error) {
        return response.json(error);
      }
    });
    response.json(true);
  },
};

export default usersController;
