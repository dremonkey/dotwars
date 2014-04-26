(function () {
  var socket = io.connect('http://127.0.0.1:3000');
        
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('death');
    socket.emit('birth');
  });
  socket.on('birth', function (user) {
    console.log(user + ' is back');
  });
  socket.on('death', function (user) {
    console.log(user + ' has died');
  });

  // $('#scoreboard')

})();