import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
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
        },
    }
);

export default usersSchema;
