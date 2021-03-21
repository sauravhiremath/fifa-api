import { Server } from 'socket.io';
import redisAdapter from 'socket.io-redis';
import consola from 'consola';

import { verifyToken } from '../middlewares';
import Room from './roomManager';
import { fixedOrigin } from './corsFixer';
import { hosts, REDIS_PORT, REDIS_HOST } from '../env';

export default app => {
    const io = new Server(app, {
        transports: ['websocket'], // To avoid sticky sessions when using multiple servers
        path: '/classic-mode',
        cors: fixedOrigin(hosts),
        rememberUpgrade: true
    });

    try {
        io.adapter(redisAdapter({ host: REDIS_HOST, port: Number(REDIS_PORT) }));
    } catch (err) {
        consola.warn(err);
    }

    consola.info('Socketio initialised!');

    const classicMode = io.of('/classic-mode');
    classicMode.use(verifySocker).on('connection', async socket => {
        const { username, roomId, password, action, options } = socket.handshake.query;
        const room = new Room({ io: classicMode, socket, username, roomId, password, action, options });

        const joinedRoom = await room.init(username);
        consola.info('Client Connected');

        if (joinedRoom) {
            room.showPlayers();
            room.isReady();
            room.shiftTurn();
        }

        room.onDisconnect();
    });

    return io;
};

const verifySocker = (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        const decoded = verifyToken(socket.handshake.query.token);
        socket.decoded = decoded;
        next();
    }
};
