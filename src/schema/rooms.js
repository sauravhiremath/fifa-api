import mongoose from 'mongoose';
import { ROOM_ID_RX } from '../env';

const roomsSchema = new mongoose.Schema({
    roomId: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    }
});

export default roomsSchema;

export function isValid(roomId) {
    // Check if roomId matches the specified regex
    const isValid = ROOM_ID_RX.test(roomId);
    return isValid;
}
