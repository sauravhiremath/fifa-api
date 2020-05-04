import socketio from 'socket.io';

import { logger } from '../middlewares';
import Room from './roomManager';

export default app => {
    const io = socketio.listen(app);

    const classicMode = io.of('/classic-mode');
    classicMode.on('connection', socket => {
        const { roomId } = socket.handshake.query;
        const room = new Room({ socket, roomId });

        // Checks if room available
        // if yes, then joins the room
        // if no, then creates new room
        room.init();
        logger.info('Client Connected');

        socket.join(room);

        socket.on('disconnect', () => {
            logger.info('Client Disconnected!');
        });
        // Const playersInRooms = room.getRoomInfo();
        // const roomList = Object.keys(rooms);
        // socket.emit('info', { playersInRooms, roomList });
    });

    return io;
};
