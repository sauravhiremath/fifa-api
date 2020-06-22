import mongoose from 'mongoose';
import { DB_URL } from './../env';
import logger from '../middlewares/logger';

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// When successfully connected
db.on('connected', () => {
    logger.info('Mongoose connection open to ATLAS Server');
});

// If the connection throws an error
db.on('error', err => {
    logger.info(`Mongoose connection error: ${err}`);
});

// When the connection is disconnected
db.on('disconnected', () => {
    logger.info('Mongoose connection disconnected');
});

export default mongoose;
