'use strict';

// Module Dependencies
var _ = require('lodash');
var Moniker = require('moniker');

var players = [];

var Player = function (handle) {
  this.handle = handle || Moniker.choose();
  this.kills = 0;
  this.deaths = 0;

  players.push(this);
};

Player.prototype.getHandle = function () {
  return this.handle;
};

Player.prototype.getKills = function () {
  return this.kills;
};

Player.prototype.getDeaths = function () {
  return this.deaths;
};

Player.prototype.updateDeaths = function () {
  this.deaths = this.deaths + 1;
};

Player.prototype.updateKills = function () {
  this.deaths = this.kills + 1;
};

module.exports = function (io) {

  var updateScoreboard = function () {
    io.sockets.emit('scoreboard', players);
  };

  var removePlayer = function (playerHandle) {

    _.remove(players, function (player) {
      return player.getHandle() === playerHandle;
    });

    updateScoreboard();
    io.sockets.emit('news', {msg: playerHandle + ' has left the game'});
  };

  io.sockets.on('connection', function (socket) {
    
    var player = new Player();
    var handle = player.getHandle();

    // Update the scoreboard with the new player
    updateScoreboard();
    
    socket.on('disconnect', function () {
      removePlayer(handle);
    });

    socket.emit('news', { msg: 'Welcome to DotWars. Your player handle is ' + handle });

    // Let the client know who this player is
    socket.emit('setPlayer', {handle: handle, players: players});

    // On connect, send out a birh event to all connected
    socket.broadcast.emit('playerJoined', handle);

    // Use for respawn
    socket.on('respawn', function () {
      console.log('birth');
      socket.broadcast.emit('birth', handle);
    });

    socket.on('death', function () {
      console.log('death');
      socket.broadcast.emit('death', handle);
    });

    socket.on('kill', function (killedPlayerHandle) {
      socket.broadcast.emit('kill', handle + ' killed ' + killedPlayerHandle);
    });

    socket.on('move', function (data) {
      // data obj should have the following keys: start, end
      // @param start (obj) x,y position to start from
      // @param end (obj) x,y position to end at

      var move = {
        playerHandle: handle,
        start: data.start,
        end: data.end
      };

      socket.broadcast.emit('move', move);
    });
  });
};
