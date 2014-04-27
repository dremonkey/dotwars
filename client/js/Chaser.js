var Chaser = function(source, target, x, y) {
  this.owner = source;
  this.target = this.getTarget(x, y);
  this.x = source.x;
  this.y = source.y;
  this.r = 10;

  var chaser = this;
  $chaser = Board.svg.selectAll('path.player').data([chaser], function(d) { return d.id; })
      
  var distance = 
  $chaser.enter().append('circle')
  	.transition()
  	.duration(2000)
    .attr({
        class: chaser.class,
        cx: target.x,
        cy: target.y,
        r: chaser.r,
    }).style({
        fill: '#d23f0f'
    });

};

Chaser.prototype.getTarget = function (x, y) {
  // get players to emit positions and map to array
  var coords = [];
  var target = coords.reduce(function(a,b) {
    var distA = Board.getDistance(x, y, a.x, a.y);
    var distB = Board.getDistance(x, y, b.x, b.y);
    return distA < distB ? a : b;
  });
  return target;
};