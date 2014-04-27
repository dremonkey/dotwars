'use strict';

// Module Dependencies
var _ = require('lodash');
var Moniker = require('moniker');

var users = [];

var User = function (handle) {
  this.handle = handle || Moniker.choose();
  this.kills = 0;
  this.deaths = 0;

  users.push(this);
};

User.prototype.getHandle = function () {
  return this.handle;
};

User.prototype.getKills = function () {
  return this.kills;
};

User.prototype.getDeaths = function () {
  return this.deaths;
};

User.prototype.updateDeaths = function () {
  this.deaths = this.deaths + 1;
};

User.prototype.updateKills = function () {
  this.deaths = this.kills + 1;
};

module.exports = function (io) {

  var updateScoreboard = function () {
    io.sockets.emit('scoreboard', users);
  };

  var removeUser = function (userHandle) {

    _.remove(users, function (user) {
      return user.getHandle() === userHandle;
    });

    updateScoreboard();
    io.sockets.emit('news', {msg: userHandle + ' has left the game'});
  };

  io.sockets.on('connection', function (socket) {
    
    var user = new User();
    var handle = user.getHandle();

    // Update the scoreboard with the new user
    updateScoreboard();
    
    socket.on('disconnect', function () {
      removeUser(handle);
    });

    socket.emit('news', { msg: 'Welcome to DotWars. Your player handle is ' + handle });

    socket.on('birth', function () {
      console.log('birth');
      socket.broadcast.emit('birth', handle);
    });

    socket.on('death', function () {
      console.log('death');
      socket.broadcast.emit('death', handle);
    });

    socket.on('kill', function (killedUserHandle) {
      socket.broadcast.emit('kill', handle + ' killed ' + killedUserHandle);
    });

    socket.on('move', function (data) {
      // data obj should have the following keys: start, end
      // @param start (obj) x,y position to start from
      // @param end (obj) x,y position to end at

      var move = {
        userHandle: handle,
        start: data.start,
        end: data.end
      };

      socket.broadcast.emit('move', move);
    });
  });
};
