'use strict';

const hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routesHome = require('./routes');
const routesUsers = require('./routes/users');
const routeTasks = require('./routes/tasks');
const routeAuth = require('./routes/auth');
const validate = require('./utils/userFunctions').validate;
dotenv.config();

// CREATE SERVER + IMPORT ROUTES
const createServer = () => {
  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  return server;
};

// START SERVER 
const init = async () => {

  const server = await createServer();

  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt','jwt',{
    key: process.env.TOKEN_SECRET,
    validate : validate,
    verifyOptions: { algorithms: ['HS256'] },
    headerKey : 'authorization'
  })

  //server.auth.default('jwt');

  server.route([...routeAuth,...routesHome,...routesUsers,...routeTasks]);

  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


init();
