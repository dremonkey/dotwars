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
		socket.emit('newPlayerSpawned');
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
	// Listen for new players (enemies) joining
	socket.on('reqPosition', function () {
		
	});
	
	socket.on('playerJoined', function (newPlayerHandle) {
		// Let the new enemy player know where I am
		socket.emit('playerPosition', {handle: player.id, x: player.x, y: player.y});
	
		console.log('add new player to the gameboard', newPlayerHandle);

		// Add new player to the gameboard
		var enemy = new Player(newPlayerHandle);
		addPlayer(enemy);
	});

	socket.on('respawn', function (handle) {
		player = new Player(handle, null, null, true);
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

