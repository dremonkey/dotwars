window.panel = {};

$(document).ready( function() {
	// resize DIVs and logos
	resizeFrames();
	$(window).resize(resizeFrames);

	// menu popper
	$("#divPanel").click( function(e) { main(e); });
});

// RESIZEFRAMES: repositions and resizes certain elements when user resizes the window
var resizeFrames = function () {
	// set popup height
	var height = $("#divMain").height();
	var newBottom = ((height / 2) - 140);
	$("#divPanel").css({'bottom': newBottom});
};


var main = (function () {
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