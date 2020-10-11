'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createToken = (user) => {

    let scopes;

    if (user.admin) {
        scopes= 'admin';
    }

    const credentials = {id:user.id};

    return jwt.sign(credentials,process.env.TOKEN_SECRET);
}


module.exports = createToken;