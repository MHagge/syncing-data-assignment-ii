const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(PORT);
console.log(`Listening on port 127.0.0.1: ${PORT}`);

// pass http server to socketio and grab websocket server as io
const io = socketio(app);

const onJoined = (sock) => {
  const socket = sock;
  socket.on('join', () => {
    socket.join('room1');
  });
};

const onUpdate = (sock) => {
  const socket = sock;
  socket.on('sandToServer', (data) => {
    data.color = 'lightpink';
    socket.broadcast.to('room1').emit('broadcastSand', data);
  });
};

const onDisconnect = (sock) => {
  const socket = sock;
  socket.on('disconnect', () => {
    socket.leave('room1');
  });
};

io.sockets.on('connection', (socket) => {
  onJoined(socket);
  onUpdate(socket);
  onDisconnect(socket);
});

console.log('Websocket server started');
