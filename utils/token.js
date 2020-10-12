'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createToken = (user) => {

    let scopes;

    if (user.admin) {
        scopes= 'admin';
    }

    const credentials = {id:user.id, scope: scopes};

    return jwt.sign(credentials,process.env.TOKEN_SECRET);
}

const decodeToken = (request, h) => {
    try {
        const auth = request.headers.authorization;
        const token = auth.split(' ');
        const decodedToken = jwt.verify(token[1], process.env.TOKEN_SECRET);
        return decodedToken;
    }
    catch(err) {
        return err;
    }


}


module.exports = {createToken,decodeToken};