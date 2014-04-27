var Board = {};
Board.svg = d3.selectAll('#gameBoard');
Board.init = function () {
    var svg = Board.svg;
    var rockData = d3.range(20).map(function (i) {
        return {
            index: i,
            weight: Math.random() * 5,
            charge: -40,
        };
    });

    var tick = function () {
        var $player = d3.selectAll('.player');
        var $rocks = d3.selectAll('.rock').data(rockData);

        physics.alpha(0.1);
    };

    var moveRocks = function (rocks) {
        rocks.transition()
            .duration(15000)
            .ease('linear')
            .attr("cx", function(d) { return Math.random() * $('#divMain').width(); })
            .attr("cy", function(d) { return Math.random() * $('#divMain').height(); })
            .each('end', function () { moveRocks(rocks) });
    };

    var physics = d3.layout.force()
        .nodes(rockData)
        .size([$('#divMain').width(), $('#divMain').height()])
        .gravity(0)
        .charge(function(node) {
            return node.charge ? node.charge : 0;
        })
        .on('tick', tick)
        .start();

    var $rocks = svg.selectAll('.rock').data(rockData)
        
    $rocks.enter().append('circle')
        .attr('class', 'rock')
        .attr({
            cx: function(d) { return d.x; },
            cy: function(d) { return d.y; },
            r: function() { return Math.random() * 30 + 15; },
        })
        .style({
            fill: '#C5C5C5', 
            stroke: 'EEEEEE',
            'stroke-weight': 2
        });

    moveRocks($rocks);
};
Board.getCollide = function (x1, y1, r1, x2, y2, r2) {
    var radius = Math.max(r1, r2);
    var distance = Physics.checkDistance(x1, y1, x2, y2);
    return distance <= radius;
};
Board.getDistance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
};
Board.getAngle = function(x1, y1, x2, y2) {
    if (y2 >= y1 && x2 >= x1) { return -180 - Math.sin((y2 - y1) / Board.getDistance(x1, y1, x2, y2)) * (180 / Math.pi()); }
    if (y2 >= y1 && x2 < x1) { return 0 - Math.sin((x2 - x1) / Board.getDistance(x1, y1, x2, y2)) * (180 / Math.pi()); }
    if (y2 < y1 && x2 >= x1) { return 0 + Math.sin((x2 - x1) / Board.getDistance(x1, y1, x2, y2)) * (180 / Math.pi());  }
    if (y2 < y1 && x2 < x1) { return 180 - Math.sin((x2 - x1) / Board.getDistance(x1, y1, x2, y2)) * (180 / Math.pi()); }
};