var socket = io.connect('http://127.0.0.1:3000');

// // Testing
// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('death');
//   socket.emit('birth');
// });

// socket.on('birth', function (user) {
//   console.log(user + ' is back');
// });

// socket.on('death', function (user) {
//   console.log(user + ' has died');
// });

var Scoreboard = function () {
  
  var that = this;

  this.$el = $('#scoreboard tbody');
  this._users = [];

  // Event Handlers
  socket.on('scoreboard', function (users) {
    that._users = users;
    that.update();
  });
};

Scoreboard.prototype.update = function () {
  
  var that = this;
  var users = this._users;
  
  this.$el.empty();

  _.each(this._users, function (user) {
    var html = '<tr><td class="userhandle">'+user.handle+'</td><td class="kills">'+user.kills+'</td><td class="deaths">'+user.deaths+'</td></tr>';
  
    that.$el.append(html);
  });
};
