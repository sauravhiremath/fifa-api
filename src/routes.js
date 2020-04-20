import usersController from './controller/usersController';
import authController from './controller/authController';


const routes = (route) => {
    route.get('/', (req, res) => {
        res.send(`Api server in running (${new Date()})`);
    });

    route.route('/login')
        .post(authController.login);

    route.route('/register')
        .post(authController.register);

    route.route('/users')
        .get(usersController.getAll)
        .post(usersController.create);

    route.route('/users/:id')
        .get(usersController.getOne)
        .put(usersController.update)
        .delete(usersController.delete)
};

export default routes;
