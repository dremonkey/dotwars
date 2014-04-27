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
	var player = new Player(1);

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

