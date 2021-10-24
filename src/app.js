import './database/db.js';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import consola from 'consola';
import routes from './routes.js';

import { socker } from './socker/index.js';
import { handleError, authenticated } from './middlewares/index.js';
import { config } from './config.js';

const app = express();
const server = new http.Server(app);
socker(server);

app.use(cors({ origin: config.ALLOWLIST_HOSTS, credentials: true }));
app.use(express.json());
app.use('/users', authenticated);
app.use('/search', authenticated);

routes(app);

app.use((error, _request, response, _) => {
  handleError(error, response);
});

app.listen(config.PORT, () => {
  consola.success(`Api listening on port ${config.PORT}!`);
});

server.listen(config.SOCKET_PORT, () => {
  consola.success(`Socker listening on port ${config.SOCKET_PORT}!`);
  consola.info(`Api and socker whitelisted for ${config.ALLOWLIST_HOSTS}`);
});
