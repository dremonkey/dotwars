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
		var exists = _.some(players, {handle: player.handle});
		if (!exists) {
			players.push(player);
		}
	}
	
	socket.on('setPlayer', function (data) {
		var handle = data.handle;
		var others = data.players;

		console.log('setPlayer', data);

		player = new Player(handle, null, null, true);
		addPlayer(player);

		for (var i = 0; i < others.length; i++) {
			addPlayer(new Player(others[i].handle));
		};
	});

	socket.on('respawn', function (handle) {
		player = new Player(handle, null, null, true);
	});

	socket.on('playerJoined', function (handle) {
		var player = new Player(handle);
		addPlayer(player);
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

