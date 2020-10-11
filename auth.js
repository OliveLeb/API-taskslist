'use strict';
const db = require('./db');

const validateBasic =  () => {

    //const { rows } = await db.query(`SELECT id,firstname,lastname,email,password FROM users WHERE email='${user.email}'`);
    //const users = request.payload;

    return async(request,username,password,h) => {

        const data = request.auth;
        const { rows } = await db.query(`SELECT id,firstname,lastname,email,password FROM users WHERE email='${data.email}'`);
       //const user = rows[0];
       /* const user = {
            email: rows[0].email
        }*/
        
        const user = rows[0];

        if(!user) {
            return {credentials: null, isValid: false};
        }

        const isValid = await Bcrypt.compare(password, user.password);
        const credentials = {email: user.email};
        return {isValid, credentials};

    }
}

module.exports = validateBasic;