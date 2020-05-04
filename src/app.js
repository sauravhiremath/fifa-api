import './database/db';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import routes from './routes';
import { socker } from './socker';
import { handleError, authenticated, logger } from './middlewares';
import { corsOptions, API_PORT } from './env';

const app = express();
const server = new http.Server(app);
socker(server, corsOptions);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', authenticated);

routes(app);

app.use((err, req, res) => {
    return handleError(err, res);
});

app.listen(API_PORT, () => {
    logger.info(`Api listening on port ${API_PORT}!`);
});

app.listen(API_PORT + 1, () => {
    logger.info(`Socker listening on port ${API_PORT + 1}!`);
});
