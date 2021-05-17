import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  protected: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  teams: {
    type: Array,
    default: [],
  },
});

export default usersSchema;
