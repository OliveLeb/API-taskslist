'use strict';

const hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routesHome = require('./routes');
const routesUsers = require('./routes/users');
const routeTasks = require('./routes/tasks');
const routeAuth = require('./routes/auth');
dotenv.config();

// CREATE SERVER + IMPORT ROUTES
const createServer = () => {
  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });



  server.route([...routeAuth,...routesHome,...routesUsers,...routeTasks]);


  return server;
};

const validate = async (request,email, password)=> {
  const user = users[email];
  if(!user){
    return {credentials: null, isValid:false};
  }
  const isValid = await Bcrypt.compare(password, user.password);
  const credentials = {id: user.id, firstname: user.firstname, lastname: user.lastname};

  return {isValid, credentials};
};

// START SERVER 
const init = async () => {

  const server = await createServer();
  await server.register(require('hapi-auth-jwt2'));
  //await server.register(require('@hapi/basic'));
  server.auth.strategy('jwt','jwt',{
    key: process.env.TOKEN_SECRET,
    validate
  });
  server.auth.default('jwt');
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


init();
