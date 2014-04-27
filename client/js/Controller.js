$(document).ready( function() {
	// Initialize GUI
	GUI.repositionElements();
	$(window).resize(GUI.repositionElements);
	$("#divPanel").click( function(e) { GUI.panelPop(e); });

	// Click and Keydown Behaviours
	$("#divMain").on("click", function(event) {
		if (!player.inMotion) Handler.click(event, player);
	});
	$("#divMain").on("keydown", function(event) {
		
	});

	// Initialize Player
	var socket = io.connect('http://127.0.0.1:3000');
	var players = [];
	var player = null;

	var addPlayer = function (player) {
		var exists = _.some(players, {id: player.id});
		console.log('player exists', player.id, exists);
		if (!exists) {
			players.push(player);
		}
	}

	// --------------------------------------------------------------
	// Initialize Enviroment for gameplay
	//
	// On connection, create a new player in the center of the screen
	socket.on('spawnPlayer', function (handle) {
		player = new Player(handle, null, null, true);
		console.log(player);
		addPlayer(player);

		// Tell the server that the new player has been created
		socket.emit('newPlayerSpawned', handle);
	});

	// Listen for the spawn enemies broadcast
	socket.on('spawnEnemy', function (enemy) {
		console.log('spawnEnemy', enemy);
		if (player.id !== enemy.handle) {
			enemy = new Player(enemy.handle, enemy.x, enemy.y);
			addPlayer(enemy);
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
		addPlayer(enemy);
	});

	socket.on('respawn', function (handle) {
		player = new Player(handle, null, null, true);
	});

	// --------------------------------------------------------------
	// Movement
	socket.on('moveEnemy', function (move) {
		var enemy = players.get(move.playerHandle);
		enemy.move(end.x, end.y);
	});

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
Handler.click = function (event, player) {
	player.move(event.clientX, event.clientY);
};
// Handler.

