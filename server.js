/*
 * The Hello API
 *
 */

 // Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const conf = require('./config');

var server = {};

// Instantiate server
server.httpServer = http.createServer(function(req, res){
  server.uniServer(req, res);
});

// Server logic defined as generic to support adding features like HTTPS support
server.uniServer = function(req, res){
  // Get url, path, query string, method, headers from request
  var pUrl = url.parse(req.url, true);
  var path = pUrl.pathname;
  var trimmed = path.replace(/^\/+|\/+$/g, '');
  var queryStringObj = pUrl.query;
  var method = req.method.toLowerCase();
  var headers = req.headers;

  // Get payload
  var decoder = new StringDecoder('utf-8');
  var buf = '';
  // Eventhandler: Data is received
  req.on('data', function(data) {
    // Append incoming data to buf
    buf += decoder.write(data);
  });
  // Eventhandler: Data stopped being received
  req.on('end', function(data) {
    // Stop reading data
    buf += decoder.end();
    // Get appropriate handler for current request
    var selectedHandler = typeof(server.router[trimmed]) !== 'undefined' ? server.router[trimmed] : server.handlers.notFound;
    // Gather data for handlers
    var data = {
      'trimmed' : trimmed,
      'queryStringObj' : queryStringObj,
      'method' : method,
      'headers' : headers,
      'payload' : buf
    }
    // Route request to handler determined by router
    selectedHandler(data, function(statusCode, payload) {
      // Default to statusCode 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Default to payload of empty object
      payload = typeof(payload) == 'object' ? payload : {};
      var payloadStr = JSON.stringify(payload);
      // Return response in JSON format
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadStr);

      console.log('Server response: ', +statusCode+ ' ' +payloadStr);
    });
  });
};

  // Define handlers
  server.handlers = {};
  // Respond with greeting
  server.handlers.hello = function(data, callback) {
    // Callback a HTTP status code and payload
    callback(200, {'greeting' : 'Well hello to you too!'});
  };
  // Default
  server.handlers.notFound = function(data, callback) {
    callback(404);
  };

  // Define request router
  server.router = {
    'hello' : server.handlers.hello
  };


  // INIT
  server.init = function(){
    server.httpServer.listen(conf.httpPort, function(){
      console.log('Server is running.. Listening on port: ' + conf.httpPort);
    });
  }


  // Export module
  module.exports = server;
