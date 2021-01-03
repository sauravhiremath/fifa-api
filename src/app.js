import './database/db';
import express from 'express';
import http from 'http';
import routes from './routes';
import cors from 'cors';
import consola from 'consola';

import { socker } from './socker';
import { handleError, authenticated } from './middlewares';
import { API_PORT, SOCKET_PORT, hosts } from './env';

const app = express();
const server = new http.Server(app);
socker(server);

app.use(cors({ origin: hosts, credentials: true }));
app.use(express.json());
app.use('/users', authenticated);
app.use('/search', authenticated);

routes(app);

app.use((err, _req, res, _) => {
    handleError(err, res);
});

app.listen(API_PORT, () => {
    consola.success(`Api listening on port ${API_PORT}!`);
});

server.listen(SOCKET_PORT, () => {
    consola.success(`Socker listening on port ${SOCKET_PORT}!`);
    consola.info(`Api and socker whitelisted for ${hosts}`);
});
