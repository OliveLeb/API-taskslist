'use strict';
const Joi = require('joi');
const db = require('../db');
  

const userSchema = Joi.object({
    firstname: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({tlds:{allow:true}}).required(),
    password : Joi.string().min(6).max(16).required(),
    image: Joi.string(),
    admin: Joi.boolean().required()
});

// GET ALL USERS
const getUsers =  {
    method: 'GET',
    path: '/users',
    config: {
     auth:{
       strategy:'jwt'
     },
    },
    handler : async (request,reply) => {
     const {rows} = await db.query('SELECT id,firstname,lastname,email,password,image,admin FROM users');
     if(!rows) return 'No users recorded.';
     return rows;
    },
  
};

// GET ONE USER
const getOneUser = {
    method: 'GET',
    path: '/users/{id}',
    config: {
     auth:{
       strategy:'jwt'
     },
    },
    handler : async (request, h) => {
      const id= request.params.id;
      const {rows} = await db.query(`SELECT id,firstname,lastname,email,password,image,admin FROM users WHERE id=${id}`);
      return rows[0];
    },
};


// UPDATE USER
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


// DELETE USER
const deleteUser = {
    method: 'DELETE',
    path: '/users/{id}',
    options:{
      auth:{
        strategy:'jwt'
      }
    },
    handler : async (request, h) => {
      const id = request.params.id;
      await db.query(`DELETE FROM users WHERE id=${id}`);    
      return 'User deleted successfully !';
    },
};

module.exports = [getUsers, getOneUser,updateUser,deleteUser];