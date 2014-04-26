var Player = function(id, x, y) {
  this.id = id;
  this.x = x || 500;
  this.y = y || 400;
  this.inMotion = false;
};

Player.prototype = {};
Player.prototype.path = "m-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z";
Player.prototype.move = function (x, y, event) {
  var player = this;
  var distance = Board.getDistance(player.x, player.y, x, y);

  player.x = x
  player.y = y;
  player.inMotion = true;
  var $player = d3.selectAll('path.player').data([player], function(d) { return d.id; })

  $player.transition()
    .ease('linear')
    .duration(distance / player.velocity)
    .attr({transform: 'translate(' + player.x + ',' + player.y +') rotate(-90)'})
    .each('end', function () { player.inMotion = false; });
  
  force.resume();
};

Player.prototype.act = function (weapon) {
  var weapons = {};
  weapons.chaser = function () {
    console.log('Chaser fired!');
  };
  // weapons.mine = function () {
  //   console.log('Mine fired!');
  // };
  weapons.shield = function () {
    console.log('Shield deployed!');
  };

  if (weapons.hasOwnProperty(weapon)) {
    weapons[weapon]();
  } else {
    console.log("Non-proper weapon name.");
  }
};

Player.prototype.die = function () {
  console.log("You died!");
};

Player.prototype.class = 'player';
Player.prototype.radius = 20;
Player.prototype.velocity = 0.25;