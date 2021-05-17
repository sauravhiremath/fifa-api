import mongoose from 'mongoose';
import roomsSchema from '../schema/rooms.js';

const roomsModel = mongoose.model('rooms', roomsSchema);

export default roomsModel;
