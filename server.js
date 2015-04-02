#!/usr/bin/env node

/**
 * Connect to Database.
 */
 
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var client = new MongoClient();
var db;

client.connect("mongodb://muhammad:bigdata@ds049171.mongolab.com:49171/bl-dataset",function(err, db) {
  if(err) {
    console.log(err);
      console.log("> Connection to database failed.");
  } else {
      console.log("> Connection to database succeded.");
      /**
       * Module dependencies.
       */

      var app = require('./app')(db.collection("images"));
      var debug = require('debug')('group12-app:server');
      var http = require('http');

      /**
       * Get port from environment and store in Express.
       */

      var port = normalizePort(process.env.PORT || '3000');
      app.set('port', port);

      /**
       * Create HTTP server.
       */

      var server = http.createServer(app);

      /**
       * Listen on provided port, on all network interfaces.
       */

      server.listen(port);
      server.on('error', onError);
      server.on('listening', onListening);

      /**
       * Normalize a port into a number, string, or false.
       */

      function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
          // named pipe
          return val;
        }

        if (port >= 0) {
          // port number
          return port;
        }

        return false;
      }

      /**
       * Event listener for HTTP server "error" event.
       */

      function onError(error) {
        if (error.syscall !== 'listen') {
          throw error;
        }

        var bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
      }

      /**
       * Event listener for HTTP server "listening" event.
       */

      function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
        debug('Listening on ' + bind);
      }
  }
});

