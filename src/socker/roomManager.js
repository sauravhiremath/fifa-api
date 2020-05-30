import bcrypt from 'bcrypt';

import logger from '../middlewares/logger';
import { isValid } from '../schema/rooms';
import { SALT_ROUNDS } from '../env';

export default class Room {
    constructor(options) {
        this.io = options.io; // Short for io.of('/your_namespace_here')
        this.socker = options.socket;
        this.username = options.username;
        this.roomId = options.roomId;
        this.password = options.password; // Optional
        this.action = options.action; // [join, create]
        this.store = options.io.adapter; // Later expanded to io.adapter.rooms[roomId]
    }

    /**
     * Summary.          Initialises steps on first connection
     *
     * Description.      Checks if room available
     *                   If yes, then joins the room.
     *                   If no, then creates new room
     *
     * @return   {bool}    Returns true if successfull, false otherwise
     */
    async init(username) {
        // Stores an array containing socket ids in 'roomId'
        let clients;
        await this.io.in(this.roomId).clients((e, _clients) => {
            clients = _clients || logger.error('[INTERNAL ERROR] Room creation failed!');
            logger.debug(`Connected Clients are: ${clients}`);
        });

        if (this.action === 'join') {
            // Check if correct password for room, if required
            // Check if room size is equal to or more than 1
            // If yes, join the socket to the room
            // If not, emit 'invalid operation: room does not exist'

            this.store = this.store.rooms[this.roomId];
            if (clients.length >= 1) {
                if (this.store.password && !(await bcrypt.compare(this.password, this.store.password))) {
                    logger.info(`[JOIN FAILED] Incorrect password for room ${this.roomId}`);
                    this.socker.emit('Error: Incorrect password!');
                    return false;
                }

                await this.socker.join(this.roomId);
                this.store.clients.push({ id: this.socker.id, username, readyStatus: false });
                this.socker.username = username;
                this.socker.emit('[SUCCESS] Successfully initialised');
                logger.info(`[JOIN] Client joined room ${this.roomId}`);
                return true;
            }

            logger.warn(`[JOIN FAILED] Client denied join, as roomId ${this.roomId} not created`);
            this.socker.emit('Error: Create a room first!');
            return false;
        }

        if (this.action === 'create') {
            // Check if room size is equal to zero
            // If yes, create new room and join socket to the room
            // If not, emit 'invalid operation: room already exists'

            if (clients.length < 1) {
                await this.socker.join(this.roomId);
                this.store = this.store.rooms[this.roomId];

                if (this.password) {
                    this.store.password = await bcrypt.hash(this.password, SALT_ROUNDS);
                }

                this.store.clients = [{ id: this.socker.id, username, readyStatus: false }];
                this.socker.username = username;
                logger.info(`[CREATE] Client created and joined room ${this.roomId}`);
                this.socker.emit('[SUCCESS] Successfully initialised');
                return true;
            }

            logger.warn(`[CREATE FAILED] Client denied create, as roomId ${this.roomId} already present`);
            this.socker.emit('Error: Room already created. Join the room!');
            return false;
        }
    }

    showPlayers() {
        // Broadcast info about { all players and their ready status } joined to given room
        // Deafult status as 'Not ready'
        const { clients } = this.store;
        this.io.to(this.roomId).emit('players-joined', { playersJoined: clients });
    }

    isReady() {
        // Mark player as ready  ---> to start the draft in the given room
        this.socker.on('is-ready', () => {
            this.store.clients.forEach(player => {
                if (player.id === this.socker.id) {
                    player.readyStatus = true;
                }
            });
        });
    }

    beginDraft() {
        // Uses shufflePlayers() --> Selects first player from list --> call startTimer()
    }

    endDraft() {
        // End Current turn
    }

    /**
     * Summary.     Shuffle the players ready in a given room in random order
     * Description. Shuffle the players ready in a given room in random order
     *
     * @listens     event:beginDraft(),nextTurn()
     *
     * @param       {string}       roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    shufflePlayers() {
        // Shuffle the order of players and return a new order
    }

    /**
     * Summary.     Ends current turn and begins timer for next player
     * Description. Check if turn is less than or equal to 15 (max players pick per draft)
     *              Begin timer for the next pick [ 30 secs each pic ]
     *              Run after shufflePlayers and each consecutive turns
     *
     * @listens     event:beginDraft(),nextTurn()
     *
     * @param       {string}       roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    shiftTurn() {
        // Check if turn is less than or equal to 15 (max players pick per draft)
        // Begin timer for the next pick [ 30 secs each pic ]
        // Run after shufflePlayers and each consecutive turns
    }

    /**
     * Summary.     Create new Room with given roomId
     * Description. Create new Room with given roomId
     *
     * @access      private
     *
     * @listens     event:init()
     *
     * @param       {string}       roomId - as specified by /^#([A-Z0-9]){6}$/
     */
    createRoom() {
        if (isValid(this.roomId)) {
            logger.info(`Room created with roomId: ${this.roomId}`);
        }
    }
}
