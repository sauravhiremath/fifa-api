import mongoose from 'mongoose';
import env from './../env';
import logger from '../middlewares/logger';

mongoose.connect(env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    }
);

const db = mongoose.connection;

// When successfully connected
db.on('connected', function () {
    logger.info('Mongoose default connection open to ' + env.DB_URL);
});

// If the connection throws an error
db.on('error', function (err) {
    logger.info('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
    logger.info('Mongoose default connection disconnected');
});

export default mongoose;