'use strict';

const hapi = require('@hapi/hapi');
const {Client} = require('pg');
const dotenv = require('dotenv');
const routesHome = require('./routes');
const routesUsers = require('./routes/users.js');
dotenv.config();

// CREATE SERVER + IMPORT ROUTES
const createServer = () => {
  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  server.route(routesHome);
  server.route(routesUsers);

  return server;
};


// CONNECTING BDD
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect()
  .then(()=>{
    console.log('Connecté à la BDD');
  })
  .catch(err=>{
    console.log(err);
  });


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
