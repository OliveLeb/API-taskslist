'use strict';

const Joi = require('joi');
const db = require('../db');
const bcrypt = require('bcrypt');
const verifyCredentials = require('../utils/userFunctions').verifyCredentials;
const createToken = require('../utils/token').createToken;
const verifyUniqueEmail = require('../utils/userFunctions').verifyUniqueEmail;


const authSchema = Joi.object({
    email: Joi.string().email({tlds:{allow:true}}).required(),
    password: Joi.string().min(6).max(16).required()
})

const userSchema = Joi.object({
    firstname: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({tlds:{allow:true}}).required(),
    password : Joi.string().min(6).max(16).required(),
    image: Joi.string(),
    admin: Joi.boolean().required()
});

const auth = {
    method: 'POST',
    path: '/login',
    options: {
        validate: {
            payload: authSchema
        },
        auth:false,
        pre: [
            { assign: 'user' ,method: verifyCredentials }
        ],    
    
        handler: async (request, h) => {

            const {user} = request.pre;            
            const token = createToken(user);
            
            return h.response('success').header('auth-token', token);

        }
    },
}


const createUser = {
    method: 'POST',
    path: '/register',
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
        // CHECK IF EMAIL ALREADY EXIST
      pre: [
        {assign:'user', method: verifyUniqueEmail }
      ],

      handler : async (request, h) => {

          const {user} = request.pre;
          if(typeof(user) === 'string' || user === null) return user;
     

          // HASH PASSWORD THEN STORE USER IN DB
          await bcrypt.genSalt(10)
          .then(salt => {
            bcrypt.hash(user.password,salt)
            .then(hash => {
              db.query(`INSERT INTO users(firstname, lastname, email, password, image, admin) 
              VALUES ('${user.firstname}','${user.lastname}','${user.email}','${hash}','${user.image}','${user.admin}')`);            
            });
          });
          const id_token = createToken(user);
          return id_token;
               
      },
    }
  
};

module.exports = [auth,createUser];