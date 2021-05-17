import mongoose from 'mongoose';
import usersSchema from '../schema/users.js';

const Users = mongoose.model('Users', usersSchema);

export default Users;

/**
 * Checks if username already exists
 * @param {username} username
 * @returns {(boolean|Object)} True if doc existing, false otherwise
 */
export async function checkExisting(username) {
  const match = await Users.findOne({ username });
  return match;
}
