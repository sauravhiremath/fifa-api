import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

describe('Initiate a socket-io connection', () => {
  let io;
  let serverSocket;
  let clientSocket;

  beforeAll(done => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', socket => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('[emit] form server and [recieve] to client message', done => {
    clientSocket.on('hello', arg => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });

  test('[emit] form client and [recieve] to server message', done => {
    serverSocket.on('hi', cb => {
      cb('hola');
    });
    clientSocket.emit('hi', arg => {
      expect(arg).toBe('hola');
      done();
    });
  });
});
