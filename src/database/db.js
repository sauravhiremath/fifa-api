import mongoose from 'mongoose';
import consola from 'consola';
import { config } from '../config.js';

mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// When successfully connected
db.on('connected', () => {
  consola.success('Mongoose connection open to', config.DB_URL);
});

// If the connection throws an error
db.on('error', error => {
  consola.warn(`Mongoose connection error: ${error}`);
});

// When the connection is disconnected
db.on('disconnected', () => {
  consola.warn('Mongoose connection disconnected');
});

export default mongoose;
