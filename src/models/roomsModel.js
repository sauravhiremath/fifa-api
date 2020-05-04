import mongoose from 'mongoose';
import roomsSchema from '../schema/rooms';

const roomsModel = mongoose.model('rooms', roomsSchema);

export default roomsModel;
