var Board = {};
Board.svg = d3.selectAll('#gameBoard');
Board.init = function () {
    var svg = Board.svg;
    var rockData = d3.range(10).map(function (i) {
        return {
            index: i,
            weight: Math.random() * 5,
            charge: 30
        };
    });

    var physics = d3.layout.force()
        .nodes(rockData)
        .size([$('#divMain').width(), $('#divMain').height()])
        .charge(function(node) {
            return node.charge ? node.charge : 0;
        })
        .start();

    var $rocks = svg.selectAll('.rock').data(rockData)
        
    $rocks.enter().append('circle')
        .attr('class', 'rock')
        .attr({
            cx: function(d) { return d.x; },
            cy: function(d) { return d.y; },
            r: function() { return Math.random() * 20 + 10; },
        })
        .style({
            fill: '#C5C5C5', 
            stroke: 'red',
            'stroke-weight': 2
        });
};
Board.getCollide = function (x1, y1, r1, x2, y2, r2) {
    var radius = Math.max(r1, r2);
    var distance = Physics.checkDistance(x1, y1, x2, y2);
    return distance <= radius;
};
Board.getDistance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
};