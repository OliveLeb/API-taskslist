'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const validate = async (request, email, password) => {
    const user = users[usernamme];
    if(!user) {
        return {credentials: null, isValid: false};
    }
}

const authSchema = Joi.object({
    email: Joi.string().email({tlds:{allow:true}}).required(),
    password: Joi.string().min(6).max(16).required()
})

const auth = {
    method: 'POST',
    path: '/login',
    options: {
        validate: {
            payload: authSchema
        },
        auth: false
    },
    handler: async (request, h) => {

        const user = request.payload;

        if(!user) {
            return {credentials: null, isValid: false};
        }

        const { rows } = await db.query(`SELECT id,firstname,lastname,email,password FROM users WHERE email='${user.email}'`);
        if(rows.length === 0) return 'Email not found.';

        const isValid = await bcrypt.compare(user.password,rows[0].password);
        if(!isValid)  return 'Invalid password.';

        const credentials = {id:rows[0].id, firstname:rows[0].firstname, lastname:rows[0].lastname};
        //return {isValid, credentials};

        const token = jwt.sign(credentials,process.env.TOKEN_SECRET);
        //return header('auth-token',token);
        return token;
   
    }
}

module.exports = [auth];