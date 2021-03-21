import mongoose from 'mongoose';
import { DB_URL } from './../env';
import consola from 'consola';

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// When successfully connected
db.on('connected', () => {
    consola.success('Mongoose connection open to', DB_URL);
});

// If the connection throws an error
db.on('error', err => {
    consola.warn(`Mongoose connection error: ${err}`);
});

// When the connection is disconnected
db.on('disconnected', () => {
    consola.warn('Mongoose connection disconnected');
});

export default mongoose;
