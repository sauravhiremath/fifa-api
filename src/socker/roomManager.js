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

    showPlayers() {
        // Broadcast info about { all players and their ready status } joined to given room
        // Deafult status as 'Not ready'
    }

    isReady() {
        // Mark player as ready  ---> to start the draft in the given room
    }

    beginDraft() {
        // Uses shufflePlayers() --> Selects first player from list --> call startTimer()
    }

    endDraft() {
        // End Current turn
    }

    /**
     * Description. Shuffle the players ready in a given room in random order
     * @listens              event:beginDraft(),nextTurn()
     * @param     {string}   roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    shufflePlayers() {
        // Shuffle the order of players and return a new order
    }

    /**
     * Description. Create new Room with given roomId
     * @listens              event:beginDraft(),nextTurn()
     * @param     {string}   roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    shiftTurn() {
        // Begin timer for the next pick [ 30 secs each pic ]
        // Run after shufflePlayers and for consecutive turns
    }

    /**
     * Description. Create new Room with given roomId
     * @access               private
     * @listens              event:init()
     * @param     {string}   roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    createRoom() {
        if (isValid(this.roomId)) {
            logger.info(`Room created with roomId: ${this.roomId}`);
        }
    }
}
