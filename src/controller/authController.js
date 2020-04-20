import usersModel from './../models/usersModel';
import jwt from 'jsonwebtoken';
import env from "../env";

const authController = {
    login: (req, res, next) => {
        const credential = req.body;
        usersModel.findOne({email: credential.email, password: credential.password}, (err, user) => {
            if (err) res.json(err);
            if (user !== null) {
                const token = jwt.sign({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name
                }, env.App_key);
                res.json({token})
            } else {
                res.json("email or password incorrect!")
            }
        });
    },

    register: (req, res, next) => {
        let user = new usersModel(req.body);
        user.save(req.body, function (err, user) {
            if (err) return res.json(err);
            res.json(user)
        })
    },
};

export default authController;