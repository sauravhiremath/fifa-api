import bcrypt from 'bcrypt';

import logger from '../middlewares/logger';
import { SALT_ROUNDS, TURN_INTERVAL } from '../env';

export default class Room {
    constructor(options) {
        this.io = options.io; // Shortname for -> io.of('/your_namespace_here')
        this.socker = options.socket;
        this.username = options.username;
        this.roomId = options.roomId;
        this.password = options.password; // Optional
        this.action = options.action; // [join, create]
        this.store = options.io.adapter; // Later expanded to io.adapter.rooms[roomId]
    }

    /**
     * Initialises steps on first connection.
     *
     * Checks if room available:
     *   If yes, then joins the room
     *   If no, then creates new room.
     *
     * @access    public
     * @return   {bool}    Returns true if initialization is successfull, false otherwise
     */
    async init(username) {
        // Stores an array containing socket ids in 'roomId'
        let clients;
        await this.io.in(this.roomId).clients((e, _clients) => {
            clients = _clients || logger.error('[INTERNAL ERROR] Room creation failed!');
            logger.debug(`Connected Clients are: ${clients}`);
        });

        if (this.action === 'join') {
            // @optional Check if correct password for room
            // Check if room size is equal to or more than 1
            //     If yes, join the socket to the room
            //     If not, emit 'invalid operation: room does not exist'

            this.store = this.store.rooms[this.roomId];
            if (clients.length >= 1) {
                if (this.store.password && !(await bcrypt.compare(this.password, this.store.password))) {
                    logger.info(`[JOIN FAILED] Incorrect password for room ${this.roomId}`);
                    this.socker.emit('Error: Incorrect password!');
                    return false;
                }

                await this.socker.join(this.roomId);
                this.store.clients.push({ id: this.socker.id, username, isReady: false });
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
            //     If yes, create new room and join socket to the room
            //     If not, emit 'invalid operation: room already exists'

            if (clients.length < 1) {
                await this.socker.join(this.roomId);
                this.store = this.store.rooms[this.roomId];

                if (this.password) {
                    this.store.password = await bcrypt.hash(this.password, SALT_ROUNDS);
                }

                this.store.clients = [{ id: this.socker.id, username, isReady: false }];
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

    /**
     * Broadcast info about all players and their ready status joined to given room. Deafult status as 'Not ready'.
     *
     * @access    public
     */
    showPlayers() {
        const { clients } = this.store;
        this.io.to(this.roomId).emit('show-players-joined', { playersJoined: clients });
    }

    /**
     * Broadcast Array of Teams [player_socket_id: [playerId1, playerId2]].
     *
     * @access    public
     */
    showTeams() {
        const { teams } = this.store.draft;
        this.io.to(this.roomId).emit('show-players-teams', { teams });
    }

    /**
     * Mark player as ready  ---> to start the draft in the given room. If all players ready then initiate the draft
     *
     * @access public
     */
    isReady() {
        this.socker.on('is-ready', () => {
            this.store.clients.forEach(player => {
                if (player.id === this.socker.id) {
                    player.isReady = true;
                }
            });
            this.showPlayers();

            const arePlayersReady = this.store.clients.every(player => player.isReady === true);
            if (arePlayersReady) {
                this.beginDraft();
            }
        });
    }

    /**
     * Initiates the draft, by resetting the game -> emitting initial turn
     *
     * @access    public
     */
    beginDraft() {
        this.store.clients = this.shufflePlayers(this.store.clients);
        this.showPlayers();
        this.io.to(this.roomId).emit('draft-start', 'The players order is shuffled and the draft has started...');
        logger.info('Draft started...');

        // Reset draft object to initial state
        this._resetCurrentGame();

        this._emitTurn(0);
        this.showTeams();
    }

    /**
     * Consume player item and update the gameState. Reset the timeout and initiate next turn.
     *
     * @access    public
     */
    shiftTurn() {
        // Check if turn is less than or equal to 15 (max players pick per draft)
        // Begin timer for the next pick [ 30 secs each pic ]
        // Run after shufflePlayers and each consecutive turns
        this.socker.on('player-turn-pass', (item = undefined) => {
            // NAME Change: player-turn-trigger would be better name
            if (this.store.clients[this.store.draft.turnNum].id === this.socker.id) {
                // Add the selected item object to the collection
                if (item) {
                    this.store.draft.teams[this.socker.id] = [...(this.store.draft.teams[this.socker.id] || []), item];
                }

                this._resetTimeOut();
                this._nextTurn();
            }

            this.showTeams();
        });
    }

    /**
     * Emit End current draft event
     *
     * @access    public
     */
    endDraft() {
        // TODO: Save the teams in mongo for further collection
        this.io.to(this.roomId).emit('draft-end', 'The draft has ended');
    }

    /**
     * Shuffle the players ready in a given room in random order.
     * Uses Fisher-Yates shuffle algorithm
     *
     * @param        {Array}    clients    Original clients list from this.store.clients
     * @return       {Array}               Shuffled order of this.store.clients
     */
    shufflePlayers(clients) {
        // Shuffle the order of players and return a new order
        let j;
        let x;
        let i;

        for (i = clients.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = clients[i];
            clients[i] = clients[j];
            clients[j] = x;
        }

        return clients;
    }

    _nextTurn() {
        this.io
            .to(this.roomId)
            .emit('player-turn-end', `${this.store.clients[this.store.draft.turnNum].username} chance ended`);
        this.io.to(this.store.clients[this.store.draft.turnNum].id).emit('personal-turn-end', 'Your chance ended');

        logger.info(`[TURN CHANGE] ${this.store.clients[this.store.draft.turnNum].username} had timeout turn change`);

        const currentTurnNum = (this.store.draft.turnNum + 1) % this.store.clients.length;
        this.store.draft.turnNum = currentTurnNum;

        this._emitTurn(currentTurnNum);
    }

    _emitTurn(currentTurnNum) {
        this.io.to(this.store.clients[currentTurnNum].id).emit('personal-turn-start', 'It is your chance to pick');
        this.io.to(this.roomId).emit('player-turn-start', `${this.store.clients[currentTurnNum].username} is picking`);
        logger.info(
            `[TURN CHANGE] ${this.store.clients[currentTurnNum].username} is the new drafter. Turn number: ${currentTurnNum}`
        );
        this._triggerTimeout();
    }

    _triggerTimeout() {
        this.store.draft.timeOut = setTimeout(() => {
            this._nextTurn();
        }, TURN_INTERVAL);
    }

    _resetTimeOut() {
        if (typeof this.store.draft?.timeOut === 'object') {
            logger.info('[TURN CHANGE] Timeout reset');
            clearTimeout(this.store.draft.timeOut);
        }
    }

    _resetCurrentGame() {
        if (this.store) {
            this._resetTimeOut();
            this.store.draft = { teams: {}, sTime: new Date(), timeOut: 0, turnNum: 0 };
        }
    }

    /**
     * Gracefully disconnect the user from the game and end the draft
     * Preserving the gameState
     *
     * @access    public
     */
    onDisconnect() {
        this.socker.on('disconnect', () => {
            try {
                this.store.clients = this.store.clients.filter(player => player.id !== this.socker.id);
                this.showPlayers();

                // Handle game reset
                this._resetTimeOut();
                this.endDraft();
                this._resetCurrentGame();
            } catch (_) {
                logger.info('[FORCE DISCONNECT] Server closed forcefully');
            }

            logger.info('Client Disconnected!');
        });
    }
}
