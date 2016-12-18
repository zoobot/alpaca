module.exports = function(io) {

  connections = [];

  io.on('connection', function(socket) {

    connections.push(socket);
    console.log('Users Connected: %s', connections.length);

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

      socket.on('quizUs', function() {
        io.to(room).emit('start');
        console.log('quizUs emitted on serverside');
      });


      socket.on('disconnect', function() {
        socket.leave(room);
        console.log('User left the room:', room);

        connections.splice(connections.indexOf(socket), 1);
        console.log('Users Connected: %s', connections.length);
      });
    });
  });
};
