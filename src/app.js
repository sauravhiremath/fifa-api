import express from 'express';
import './database/db';
import env from './env';
import routes from './routes';
import bodyParser from 'body-parser';
import http from 'http';
import socker from './socker';
import authenticated from './middlewares/authenticated';
import logger from './middlewares/logger';

export const app = express();
export const server = new http.Server(app);
socker(server, env.corsOptions);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', authenticated);

routes(app);

app.listen(env.API_PORT, () => {
    logger.info(`Api listening on port ${env.API_PORT}!`);
});

app.listen(env.API_PORT + 1, () => {
    logger.info(`Socker listening on port ${env.API_PORT + 1}!`);
});
