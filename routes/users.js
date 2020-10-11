'use strict';
const Joi = require('joi');
const db = require('../db');
const bcrypt = require('bcrypt');
const createToken = require('../utils/token');
const verifyUniqueEmail = require('../utils/userFunctions').verifyUniqueEmail;

  

const userSchema = Joi.object({
    firstname: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({tlds:{allow:true}}).required(),
    password : Joi.string().min(6).max(16).required(),
    image: Joi.string(),
    role: Joi.string().valid('admin','user').required()
});

const getUsers =  {
    method: 'GET',
    path: '/users',
    handler : async (request,reply) => {
     const {rows} = await db.query('SELECT id,firstname,lastname,email,password,image,role FROM users');
     return rows;
    },
   options: {
     auth:false
    },
};

const getOneUser = {
    method: 'GET',
    path: '/users/{id}',
    handler : async (request, h) => {
      const id= request.params.id;
      const {rows} = await db.query(`SELECT id,firstname,lastname,email,password,image,role FROM users WHERE id=${id}`);
      return rows[0];
    },
};

const createUser = {
    method: 'POST',
    path: '/users',
    options: {
      validate: {
            payload : userSchema,
            failAction(request, h, err) {
              throw err;
            },
            options: {
              abortEarly: false
            }
        },
        auth: false,
      pre: [
        {assign:'user', method: verifyUniqueEmail }
      ],

      handler : async (request, res) => {

          const {user} = request.pre;
        

          // IF NOT HASH PASSWORD AND STORE USER IN DB
          await bcrypt.genSalt(10)
          .then(salt => {
            bcrypt.hash(user.password,salt)
            .then(hash => {
              db.query(`INSERT INTO users(firstname, lastname, email, password, image, role) 
              VALUES ('${user.firstname}','${user.lastname}','${user.email}','${hash}','${user.image}','${user.role}')`);            
            });
          });
          const id_token = createToken(user);
          return id_token;
          //return 'User created successfully !';   
        //return {id_token: createToken(user)}.code(201);     
      },
    }
  
};

const updateUser = {
    method: 'PUT',
    path: '/users/{id}',
    handler : (request, h) => {
      const user = request.payload;
      //await db.query('')
      return 'User updated !';
    },
    options: {
      validate: {
        payload: userSchema
      }
    }
};

const deleteUser = {
    method: 'DELETE',
    path: '/users/{id}',
    options:{
      auth:false
    },
    handler : async (request, h) => {
      const id = request.params.id;
      await db.query(`DELETE FROM users WHERE id=${id}`);    
      return 'User deleted successfully !';
    },
};

module.exports = [getUsers, getOneUser,createUser,updateUser,deleteUser];