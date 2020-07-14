import socketio from 'socket.io';

import { logger, verifyToken } from '../middlewares';
import Room from './roomManager';
import { fixedOrigin } from './corsFixer';
import { hosts } from '../env';

export default app => {
    const io = socketio.listen(app, {
        path: '/classic-mode',
        origins: fixedOrigin(hosts)
    });

    logger.info('Started listening!');

    const classicMode = io.of('/classic-mode');
    classicMode.use(verifySocker).on('connection', async socket => {
        const { username, roomId, password, action } = socket.handshake.query;
        const room = new Room({ io: classicMode, socket, username, roomId, password, action });

        const joinedRoom = await room.init(username);
        logger.info('Client Connected');

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
