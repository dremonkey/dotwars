'use strict';

// Module Dependencies
var _ = require('lodash');
var Moniker = require('moniker');

var Players = function () {
  this._players = [];
};

Players.prototype.get = function (handle) {
  return _.find(this._players, function (player) {
    return player.getHandle() === handle;
  });
};

Players.prototype.add = function (player) {
  this._players.push(player);
};

Players.prototype.remove = function (handle) {
  _.remove(this._players, function (player) {
    return player.getHandle() === handle;
  });
};

Players.prototype.all = function () {
  return this._players;
};

var Player = function (handle) {
  this.handle = handle || Moniker.choose();
  this.kills = 0;
  this.deaths = 0;
  this.x = 500; // not accurate... only accurate at spawn time
  this.y = 500; // not accurate... only accurate at spawn time
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

Player.prototype.updatePos = function (x, y) {
  this.x = x;
  this.y = y;
};

var players = new Players();

module.exports = function (io) {

  var updateScoreboard = function () {
    io.sockets.emit('scoreboard', players.all());
  };

  var removePlayer = function (playerHandle) {
    players.remove(playerHandle);
    updateScoreboard();
    io.sockets.emit('news', {msg: playerHandle + ' has left the game'});
  };

  io.sockets.on('connection', function (socket) {
    
    var player = new Player();
    var handle = player.getHandle();

    // Add player to the players object
    players.add(player);

    // Update the scoreboard with the new player
    updateScoreboard();
    
    socket.on('disconnect', function () {
      removePlayer(handle);
    });

    socket.emit('news', { msg: 'Welcome to DotWars. Your player handle is ' + handle });

    // spawn the player
    socket.emit('spawnPlayer', handle);

    // asks each connection to return their current position 
    // position will be returned via the 'playersPosition' broadcast.
    socket.broadcast.emit('reqPosition');

    socket.on('newPlayerSpawned', function (handle) {
      // Let everyone know who the new player is...
      socket.broadcast.emit('playerJoined', handle);
    });

    socket.on('playerPosition', function (data) {
      socket.broadcast.emit('spawnEnemy', {handle: data.handle, x: data.x, y: data.y});
    });

    // Use for respawn
    socket.on('respawn', function () {
      socket.broadcast.emit('birth', handle);
    });

    socket.on('death', function () {
      socket.broadcast.emit('death', handle);
    });

    socket.on('kill', function (killedPlayerHandle) {
      socket.broadcast.emit('kill', handle + ' killed ' + killedPlayerHandle);
    });

    socket.on('move', function (data) {
      // data obj should have the following keys: start, end
      // @param start (obj) x,y position to start from
      // @param end (obj) x,y position to end at

      socket.broadcast.emit('moveEnemy', data);
    });
  });
};
