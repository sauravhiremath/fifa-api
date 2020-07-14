import './database/db';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';

import { socker } from './socker';
import { handleError, authenticated, logger } from './middlewares';
import { API_PORT, hosts } from './env';

const app = express();
const server = new http.Server(app);
socker(server);

app.use(cors({ origin: hosts, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', authenticated);
app.use('/search', authenticated);

routes(app);

app.use((err, _req, res, _) => {
    handleError(err, res);
});

app.listen(API_PORT, () => {
    logger.info(`Api listening on port ${Number(API_PORT)}!`);
});

server.listen(Number(API_PORT) + 1, () => {
    logger.info(`Socker listening on port ${Number(API_PORT) + 1}!`);
    logger.info(`Api and socker whitelisted for ${hosts}`);
});
