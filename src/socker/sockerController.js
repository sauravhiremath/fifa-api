import socketio from 'socket.io';

import { logger } from '../middlewares';
import Room from './roomManager';

export default app => {
    const io = socketio.listen(app, {
        path: '/classic-mode',
        origins: ['http://localhost:3000']
    });

    logger.info('Started listening!');

    const classicMode = io.of('/classic-mode');
    classicMode.on('connection', async socket => {
        const { username, roomId, password, action } = socket.handshake.query;
        const room = new Room({ io: classicMode, socket, username, roomId, password, action });

        const joinedRoom = await room.init(username);
        logger.info('Client Connected');

        if (joinedRoom) {
            room.showPlayers();
            room.isReady();
            room.beginDraft();
        }

        room.onDisconnect();
        // Const playersInRooms = room.getRoomInfo();
        // const roomList = Object.keys(rooms);
        // socket.emit('info', { playersInRooms, roomList });
    });

    return io;
};
