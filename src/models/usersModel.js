import mongoose from 'mongoose';
import usersSchema from './../schema/users';

const usersModel = mongoose.model('users', usersSchema);

export default usersModel;