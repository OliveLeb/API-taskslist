'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const users = require('../routes/users');
dotenv.config();

const createToken = (user) => {

    let scopes;

    if (user.role === 'admin') {
        scopes= 'admin';
    }

    const credentials = {id:user.id, email:user.email, scope: scopes};

    return jwt.sign(credentials,process.env.TOKEN_SECRET);
}

module.exports = createToken;