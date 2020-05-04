import logger from '../middlewares/logger';
import { isValid } from '../schema/rooms';

export default class Room {
    constructor(options) {
        this.socket = options.socket;
        this.roomId = options.roomId;
        this.action = options.action; // [join, create]
    }

    init() {
        if (this.action === 'join') {
            // Check if room size is equal to or more than 1
            // If yes, join the socket to the room
            // If not, emit 'invalid operation: room does not exist'
        } else {
            // Check if room size is equal to zero
            // If yes, create new room
            // If not, emit 'invalid operation: room already exists'
        }
    }

    currentPlayers() {
        // Broadcast info about all players joined to given room
    }

    /**
     * Description. Create new Room with given roomId
     * @access         private
     * @listens event:init()
     * @param {string} roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    _createRoom(roomId) {
        if (isValid(roomId)) {
            logger.info(`Room created with roomId: ${roomId}`);
        }
    }
}
