var Chaser = function(id, x, y) {
  this.owner = id;
  this.x = x;
  this.y = y;

  var chaser = this;
  $chaser = Board.svg.selectAll('path.player').data([chaser], function(d) { return d.id; })
      
  $chaser.enter().append('circle')
    .attr({
        class: chaser.class,
        d: chaser.path,
        r: chaser.radius,
        transform: 'translate(' + chaser.x + ',' + chaser.y +') rotate(-90)'
    }).style({
        fill: 'orange'
    });


};