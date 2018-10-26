/*
 * Primary file for API
 *
 */

 // Dependencies
 var server = require('./server');
 var cluster = require('cluster');
 var os = require('os');

// App Container
var app = {};

// Init function
app.init = function(callback){
  if(cluster.isMaster){
      for(var i=0; i < os.cpus().length; i++){
        // fork master thread for every core
        cluster.fork();
      }
  } else {
    // start server
    server.init();
  }
};

// Self invoke 
if(require.main === module){
  app.init(function(){});
}

// Export App
module.exports = app;
