var Players = function () {
  this._players = [];
};

Players.prototype.get = function (handle) {
	console.log(handle);
  return _.find(this._players, function (player) {
    return player.id === handle;
  });
};

Players.prototype.add = function (player) {
	var exists = _.some(this._players, {id: player.id});
	if (!exists) this._players.push(player);
};

Players.prototype.remove = function (handle) {
  _.remove(this._players, function (player) {
    return player.id === handle;
  });
};

Players.prototype.all = function () {
  return this._players;
};

$(document).ready( function() {
	// Initialize GUI
	GUI.repositionElements();
	$(window).resize(GUI.repositionElements);
	$('#divPanel').click( function(e) { GUI.panelPop(e); });

	// Click and Keydown Behaviours
	$('#divMain').on('mousemove', function(event) {
		if (!player.inMotion) Handler.mousemove(event, player);
	});
	$('#divMain').on('click', function(event) {
		Handler.click(event, player);
	})

	// Initialize Player
	var socket = io.connect('http://127.0.0.1:3000');
	var players = new Players();
	var player = null;


	// --------------------------------------------------------------
	// Initialize Enviroment for gameplay
	//
	// On connection, create a new player in the center of the screen
	socket.on('spawnPlayer', function (handle) {
		player = new Player(handle, null, null, true);
		console.log(player);
		players.add(player);

		// Tell the server that the new player has been created
		socket.emit('newPlayerSpawned', handle);
	});

	// Listen for the spawn enemies broadcast
	socket.on('spawnEnemy', function (enemy) {
		console.log('spawnEnemy', enemy);
		if (player.id !== enemy.handle) {
			enemy = new Player(enemy.handle, enemy.x, enemy.y);
			players.add(enemy);
		}
	});

	// --------------------------------------------------------------
	//
	// Let the new enemy player know where I am
	socket.on('reqPosition', function () {
		console.log('sending current position');
		socket.emit('playerPosition', {handle: player.id, x: player.x, y: player.y});
	});

	// Listen for new players (enemies) joining
	socket.on('playerJoined', function (newPlayerHandle) {
		console.log('add new player to the gameboard', newPlayerHandle);

		// Add new player to the gameboard
		var enemy = new Player(newPlayerHandle);
		players.add(enemy);
	});

	socket.on('respawn', function (handle) {
		player = new Player(handle, null, null, true);
	});

	// --------------------------------------------------------------
	// Movement
	socket.on('moveEnemy', function (move) {
		console.log(move);
		var enemy = players.get(move.handle);
		enemy.move(move.x, move.y);
	});

	setInterval(function () {
		socket.emit('move', {handle: player.id, x: player.x, y: player.y});
	}, 500);

	// Load Board
	Board.init();
});

/* 
GUI FUNCTIONS:
repositionElements(): repositions instructions panel
panelPop(): handles panel popping
*/

var GUI = {};
GUI.repositionElements = function () {
	// set popup height
	var height = $("#divMain").height();
	var newBottom = ((height / 2) - 140);
	$("#divPanel").css({'bottom': newBottom});
};
GUI.panelPop = (function () {
	var popped = false;
	var handler = function (event) {
		if (!popped) {
			$("#divPanel").animate({'left': '+=210'}, 500, 'swing');
			popped = true;
		} else {
	        $('#divPanel').animate({'left': '-=210'}, 500, 'swing');
	        popped = false;
		}			
	};
    return handler;
})();

/*
CONTROLLER
*/
var Handler = {};
Handler.mousemove = function (event, player) {
	player.mouseX = event.clientX;
	player.mouseY = event.clientY;
	player.move(event.clientX, event.clientY);
};
Handler.click = function (event, player) {
	console.log(player, ' clicked!');
};
	// jwerty.key('←', function(event) {
	// 	player.move(player.x - player.velocity, player.y, event);
	// });
	// jwerty.key('↓', function(event) {
	// 	player.move(player.x, player.y + player.velocity, event);
	// });
	// jwerty.key('↑', function(event) {
	// 	player.move(player.x , player.y - player.velocity, event);
	// });
	// jwerty.key('→', function(event) {
	// 	player.move(player.x + player.velocity, player.y, event);
	// });
	// jwerty.key('←'+'↑', function(event) {
	// 	player.move(player.x - player.velocity, player.y - player.velocity, event);
	// });
	// jwerty.key('←'+'↓', function(event) {
	// 	player.move(player.x - player.velocity, player.y + player.velocity, event);
	// });
	// jwerty.key('→'+'↑', function(event) {
	// 	player.move(player.x + player.velocity, player.y - player.velocity, event);
	// });
	// jwerty.key('→'+'↓', function(event) {
	// 	player.move(player.x + player.velocity, player.y + player.velocity, event);
	// });

