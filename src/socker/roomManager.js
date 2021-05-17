import bcrypt from 'bcrypt';
import consola from 'consola';
// eslint-disable-next-line no-unused-vars
import { Server, Socket } from 'socket.io';
// eslint-disable-next-line no-unused-vars
import { Adapter } from 'socket.io-adapter';

import { config } from '../config.js';

const { SALT_ROUNDS, DEFAULT_MAX_PLAYERS, DEFAULT_MAX_TIMER } = config;

export default class Room {
  constructor(options) {
    /** @type { Server } */
    this.io = options.io; // Shortname for -> io.of('/your_namespace_here')
    /** @type { Socket } */
    this.socker = options.socket;
    this.username = options.username;
    this.roomId = options.roomId;
    this.password = options.password; // Optional
    this.action = options.action; // [join, create]
    /** @type { Adapter } */
    this.store = options.io.adapter; // Later expanded to io.adapter.rooms[roomId]
    this.options = {
      maxPlayersLimit: DEFAULT_MAX_PLAYERS,
      maxTimerLimit: DEFAULT_MAX_TIMER,
    };
    if (!options.options) {
      this.options = JSON.parse(options.options);
    }
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
    const clients = await this.io.in(this.roomId).allSockets();
    if (!clients) {
      consola.error('[INTERNAL ERROR] Room creation failed!');
    }

    consola.debug(`Connected Clients are: ${clients}`);

    if (this.action === 'join') {
      // @optional Check if correct password for room
      // Check if room size is equal to or more than 1
      //     If yes, join the socket to the room
      //     If not, emit 'invalid operation: room does not exist'

      this.store = this.store.rooms.get(this.roomId);
      if (clients.size > 0) {
        if (this.store.password && !(await bcrypt.compare(this.password, this.store.password))) {
          consola.info(`[JOIN FAILED] Incorrect password for room ${this.roomId}`);
          this.socker.emit('Error: Incorrect password!');
          return false;
        }

        await this.socker.join(this.roomId);
        this.store.clients.push({ id: this.socker.id, username, isReady: false });
        this.socker.username = username;
        this.socker.emit('[SUCCESS] Successfully initialised', {
          roomId: this.roomId,
          password: this.password,
          options: this.options,
        });
        consola.info(`[JOIN] Client joined room ${this.roomId}`);
        return true;
      }

      consola.warn(`[JOIN FAILED] Client denied join, as roomId ${this.roomId} not created`);
      this.socker.emit('Error: Create a room first!');
      return false;
    }

    if (this.action === 'create') {
      // Check if room size is equal to zero
      //     If yes, create new room and join socket to the room
      //     If not, emit 'invalid operation: room already exists'

      if (clients.size === 0) {
        await this.socker.join(this.roomId);
        this.store = this.store.rooms.get(this.roomId);

        if (this.password) {
          this.store.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        }

        this.store.clients = [{ id: this.socker.id, username, isReady: false }];

        this.socker.username = username;
        consola.info(`[CREATE] Client created and joined room ${this.roomId}`);
        this.socker.emit('[SUCCESS] Successfully initialised', {
          roomId: this.roomId,
          password: this.password,
          options: this.options,
        });
        return true;
      }

      consola.warn(`[CREATE FAILED] Client denied create, as roomId ${this.roomId} already present`);
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
      for (const player of this.store.clients) {
        if (player.id === this.socker.id) {
          player.isReady = true;
        }
      }

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
    consola.info('Draft started...');

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
    // TODO: Save the teams in DB as a collection
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

    consola.info(`[TURN CHANGE] ${this.store.clients[this.store.draft.turnNum].username} had timeout turn change`);

    const currentTurnNumber = (this.store.draft.turnNum + 1) % this.store.clients.length;
    this.store.draft.turnNum = currentTurnNumber;

    this._emitTurn(currentTurnNumber);
  }

  _emitTurn(currentTurnNumber) {
    this.io.to(this.store.clients[currentTurnNumber].id).emit('personal-turn-start', 'It is your chance to pick');
    this.io.to(this.roomId).emit('player-turn-start', `${this.store.clients[currentTurnNumber].username} is picking`);
    consola.info(
      `[TURN CHANGE] ${this.store.clients[currentTurnNumber].username} is the new drafter. Turn number: ${currentTurnNumber}`
    );
    this._triggerTimeout();
  }

  _triggerTimeout() {
    this.store.draft.timeOut = setTimeout(() => {
      this._nextTurn();
    }, this.store.draft.maxTimerLimit);
  }

  _resetTimeOut() {
    if (typeof this.store.draft?.timeOut === 'object') {
      consola.info('[TURN CHANGE] Timeout reset');
      clearTimeout(this.store.draft.timeOut);
    }
  }

  _resetCurrentGame() {
    if (this.store) {
      this._resetTimeOut();
      this.store.draft = {
        teams: {},
        sTime: new Date(),
        timeOut: 0,
        turnNum: 0,
        maxPlayersLimit: this.options.maxPlayersLimit,
        maxTimerLimit: this.options.maxTimerLimit,
      };
    }

    if (this.options) {
      consola.info(`[USER-CONFIG] ${JSON.stringify(this.options)}`);
    } else {
      consola.info(`[DEFAULT-CONFIG] ${JSON.stringify(this.options)}`);
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
      } catch {
        consola.info('[FORCE DISCONNECT] Server closed forcefully');
      }

      consola.info('Client Disconnected!');
    });
  }
}
