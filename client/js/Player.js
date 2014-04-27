var Player = function(id, x, y, isUser) {
  this.id = id;
  this.x = x || 500;
  this.y = y || 400;
  this.isUser = isUser || false;
  this.inMotion = false;
  this.hasChaser = false;
  this.mouseX = null;
  this.mouseY = null;

  var player = this;
  $player = Board.svg.selectAll('path.player').data([player], function(d) { return d.id; })
      
  $player.enter().append('path')
    .attr({
        id: player.id,
        class: player.class,
        d: player.path,
        r: player.radius,
        transform: 'translate(' + player.x + ',' + player.y +') rotate(-90)'
    }).style({
        fill: function () { return player.isUser ? 'orange' : 'red' }
    });
};

Player.prototype = {};
Player.prototype.path = "m-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z";
Player.prototype.move = function (targetX, targetY) {
  var player = this;
  var distance = Board.getDistance(player.x, player.y, targetX, targetY);
  // var angle = Board.getAngle(player.x, player.y, targetX, targetY);
  var angle = '-90';

  player.x = targetX;
  player.y = targetY;
  player.inMotion = true;
  var $player = d3.selectAll('path.player').data([player], function(d) { return d.id; })

  $player.transition()
    .ease('linear')
    .duration(distance / player.velocity)
    .attr({transform: 'translate(' + player.x + ',' + player.y +') rotate(' + angle + ')'})
    .each('end', function () { player.inMotion = false; });
  
  Board.physics.resume();
};

Player.prototype.act = function (weapon) {
  var player = this;
  var chaser = new Chaser()
};


Player.prototype.die = function () {

  console.log("You died!");
};

Player.prototype.class = 'player';
Player.prototype.radius = 20;
Player.prototype.velocity = 0.3;