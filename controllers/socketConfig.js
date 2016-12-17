module.exports = function(io) {

  connections = [];

  io.on('connection', function(socket) {

    connections.push(socket);
    console.log('Connection: %s users connected', connections.length);

    socket.on('join', function(room) {
      socket.join(room);
      console.log('new user in room:', room);

      // io.in(room).emit('addUser', socket);

      socket.on('URL', function(data) {
        io.to(room).emit('loadUrl', data.url);
        console.log('serverside data.URL', data.url);
      });


      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });

      socket.on('playPause', function() {
        io.to(room).emit('start');
        console.log('playPause emitted on serverside');
      });


      socket.on('disconnect', function() {
        socket.leave(room);
        console.log('User left the room:', room);

        connections.splice(connections.indexOf(socket), 1);
        console.log('Connection: %s users connected', connections.length);
      });
    });
  });
};
