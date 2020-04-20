import usersModel from '../models/usersModel'

const usersController = {

    getAll: async (req, res, next) => {
        usersModel.find({}, (err, users) => {
            if (err) return res.json(err);
            res.json(users);
        });
    },

    getOne: (req, res, next) => {
        usersModel.findById(req.params.id, (err, user) => {
            res.json(user || {});
        });
    },

    create: (req, res, next) => {
        usersModel.create(req.body, function (err, user) {
            if (err) return res.json(err);
            res.json(user)
        })
    },

    update: (req, res, next) => {
        usersModel.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
            if (err) return res.json(err);
            res.json(user)
        });
    },

    delete: (req, res, next) => {
        usersModel.remove({_id: req.params.id}, (err, ok) => {
            if (err) return res.json(err);
        });
        res.json(true)
    }
};

export default usersController;