'use strict';

// Module Dependencies
var _ = require('lodash');
var Moniker = require('moniker');

module.exports = function (io) {

  var users = [];

  var updateScoreboard = function () {
    io.sockets.emit('scoreboard', users);
  };

  var addUser = function () {
    
    var user = {
      handle: Moniker.choose(),
      kills: 0,
      deaths: 0
    };

    users.push(user);
    updateScoreboard();
    return user;
  };

  var removeUser = function (userHandle) {

    _.remove(users, function (user) {
      return user.handle === userHandle;
    });

    updateScoreboard();
    io.sockets.emit('news', {msg: userHandle + ' has left the game'});
  };

  io.sockets.on('connection', function (socket) {
    
    var user = addUser();
    
    socket.on('disconnect', function () {
      removeUser(user.handle);
    });

    socket.emit('news', { msg: 'Welcome to DotWars. Your player handle is ' + user.handle });

    socket.on('birth', function () {
      console.log('birth');
      socket.broadcast.emit('birth', user.handle);
    });

    socket.on('death', function () {
      console.log('death');
      socket.broadcast.emit('death', user.handle);
    });

    socket.on('move', function (data) {
      // data obj should have the following keys: start, end
      // @param start (obj) x,y position to start from
      // @param end (obj) x,y position to end at

      var move = {
        userHandle: user.handle,
        start: data.start,
        end: data.end
      };

      socket.broadcast.emit('move', move);
    });
  });
};
