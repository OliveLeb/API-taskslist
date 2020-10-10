'use strict';

const hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routesHome = require('./routes');
const routesUsers = require('./routes/users.js');
const routeTasks = require('./routes/tasks');
dotenv.config();

// CREATE SERVER + IMPORT ROUTES
const createServer = () => {
  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  server.route(routesHome);
  server.route(routesUsers);
  server.route(routeTasks);

  return server;
};

// START SERVER 
const init = async () => {

  const server = await createServer();
  server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


init();
