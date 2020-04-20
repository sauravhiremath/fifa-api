import express from 'express';
import './database/db';
import env from './env';
import routes from './routes';
import bodyParser from 'body-parser'
import authenticated from './middlewares/authenticated';
import logger from './middlewares/logger';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/users', authenticated);

routes(app);

app.listen(env.Api_port, () => {
    logger.info(`Api listening on port ${env.Api_port}!`);
});