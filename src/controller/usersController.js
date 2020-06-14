import usersModel from '../models/usersModel';

const usersController = {
    getAll: async (req, res, _) => {
        usersModel.find({}, (err, users) => {
            if (err) {
                return res.json(err);
            }

            res.json(users);
        });
    },

    getOne: (req, res, _) => {
        usersModel.findById(req.params.id, (err, user) => {
            if (err) {
                return res.json(err);
            }

            res.json(user || {});
        });
    },

    create: (req, res, _) => {
        usersModel.create(req.body, (err, user) => {
            if (err) {
                return res.json(err);
            }

            res.json(user);
        });
    },

    update: (req, res, _) => {
        usersModel.findOneAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
            if (err) {
                return res.json(err);
            }

            res.json(user);
        });
    },

    delete: (req, res, _) => {
        usersModel.remove({ _id: req.params.id }, (err, _) => {
            if (err) {
                return res.json(err);
            }
        });
        res.json(true);
    }
};

export default usersController;
