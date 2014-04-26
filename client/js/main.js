$(document).ready( function() {
	// Initialize GUI
	GUI.repositionElements();
	$(window).resize(GUI.repositionElements);
	$("#divPanel").click( function(e) { GUI.panelPop(e); });

	// Initialize Game State


});

/* 
GUI FUNCTIONS:
repositionElements(): repositions instructions panel
panelPop(): handles panel popping
*/

window.GUI = {};
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

