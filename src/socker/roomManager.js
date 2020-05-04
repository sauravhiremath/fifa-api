import logger from '../middlewares/logger';
import { isValid } from '../schema/rooms';

export default class Room {
    /**
     * Create new Room
     * @param {string} roomId - RoomId for new Room RegEx - /^#([A-Z0-9]){6}$/
     */
    createRoom(roomId) {
        if (isValid(roomId)) {
            logger.info(`Room created with roomId: ${roomId}`);
        }
    }
}
