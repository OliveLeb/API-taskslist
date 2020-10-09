'use strict';

const hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routesHome = require('./routes');
const routesUsers = require('./routes/users.js');
dotenv.config();


const createServer = () => {
  const server = hapi.server({
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
  });

  server.route(routesHome);
  server.route(routesUsers);
  /*server.route(routes);
  server.route(routes);
  server.route(routes);*/

  return server;
};

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
