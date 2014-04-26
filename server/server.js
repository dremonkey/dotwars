'use strict';

// Module dependencies
var express = require('express')
  , http = require('http')
  , io = require('socket.io');

var Config = require('./config/index.js')
  , log = require('./utils/logger')
  , middleware = require('./middleware')
  , routes = require('./routes');

var config = new Config();

var startServer = function startServer (server, configObj) {

  server.set('port', configObj.server.port);
  
  var app = http.createServer(server).listen(server.get('port'), function () {
    log.info('Express server listening on port ' + server.get('port'));
  });

  io.listen(app);
};

var setupSockets = function () {
  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
};

// Sets up the express server instance
// Instantiates the routes, middleware, and starts the http server
var init = function init (server) {

  // Retrieve the configuration object
  var configObj = config.get();

  // ## Middleware
  middleware(server, configObj);

  // ## Initialize Routes
  routes.api(server, configObj);

  // Forward remaining requests to index
  server.all('/*', function (req, res) {
    // res.render('index.ect');
    res.sendfile('index.html', {root: server.get('views')});
  });

  // Start the server
  startServer(server, configObj);
  setupSockets();
};

// Initializes the server
config.load().then(function () {
  log.info('Configurations loaded... initializing the server');
  init(express());
});