'use strict';

// Module dependencies
var express = require('express')
  , http = require('http')
  , io = require('socket.io');

var Config = require('./config/index.js')
  , log = require('./utils/logger')
  , middleware = require('./middleware')
  , routes = require('./routes')
  , sockets = require('./sockets.js');

var config = new Config();
var server = express();

var startServer = function startServer (configObj) {
  server.set('port', configObj.server.port);
  
  return http.createServer(server).listen(server.get('port'), function () {
    log.info('Express server listening on port ' + server.get('port'));
  });
};

// Sets up the express server instance
// Instantiates the routes, middleware, and starts the http server
var init = function init () {

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
  var serverInstance = startServer(configObj);

  // Sockets must be initialized after the server
  io = io.listen(serverInstance);
  sockets(io);
};

// Initializes the server
config.load().then(function () {
  log.info('Configurations loaded... initializing the server');
  init();
});

module.exports = server;