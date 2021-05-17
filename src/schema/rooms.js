import mongoose from 'mongoose';
import { config } from '../config.js';

const roomsSchema = new mongoose.Schema({
  roomId: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
});

export default roomsSchema;

export function isValid(roomId) {
  // Check if roomId matches the specified regex
  const isValid = config.ROOM_ID_RX.test(roomId);
  return isValid;
}
