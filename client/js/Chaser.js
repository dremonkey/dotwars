var Chaser = function(source, target, x, y) {
  this.owner = source;
  this.target = target;
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