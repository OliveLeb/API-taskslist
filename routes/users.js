'use strict';
const Joi = require('joi');
const db = require('../db');

  

const userSchema = Joi.object({
    firstname: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({tlds:{allow:true}}).required(),
    password : Joi.string().required(),
    image: Joi.string(),
    role: Joi.string().valid('admin','user').required()
});

const getUsers =  {
    method: 'GET',
    path: '/users',
    handler : async (request,reply) => {
     const {rows} = await db.query('SELECT id,firstname,lastname FROM users');
     return rows;
    },
};

const getOneUser = {
    method: 'GET',
    path: '/users/{id}',
    handler : async (request, h) => {
      const id= request.params.id;
      const {rows} = await db.query(`SELECT id,firstname,lastname FROM users WHERE id=${id}`);
      return rows[0];
    },
};

const createUser = {
    method: 'POST',
    path: '/users',
    handler : (request, h) => {
        //return 'Create user';
        const user = request.payload;
        return user;
    },
    options: {
        validate: {
            payload : userSchema
        }
    }
};

//client.query(`INSERT INTO users (firstname,lastname,email,password,image,role)
//VALUES ('','','','','','')`);

const updateUser = {
    method: 'PUT',
    path: '/users/{id}',
    handler : (request, h) => {
        return 'Update user';
    },
};

const deleteUser = {
    method: 'DELETE',
    path: '/users/{id}',
    handler : (request, h) => {
        return 'Delete user';
    },
};

module.exports = [getUsers, getOneUser,createUser,updateUser,deleteUser];