import usersController from './controller/usersController';
import authController from './controller/authController';
import searchController from './controller/searchController';

const routes = route => {
    route.get('/', (req, res) => {
        res.send(`Api server in running (${new Date()})`);
    });

    route.route('/auth/getWebsocketIp').get(authController.getExternalIp);

    route.route('/auth/login').post(authController.login);

    route.route('/auth/verify').post(authController.verify);

    route.route('/auth/register').post(authController.register);

    route.route('/users').get(usersController.getAll).post(usersController.create);

    route.route('/users/:id').get(usersController.getOne).put(usersController.update).delete(usersController.delete);

    route.route('/search').post(searchController.search);
};

export default routes;
