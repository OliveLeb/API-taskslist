'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');

const verifyUniqueEmail = async (request,h) => {

    const user = request.payload;
    
    // CHECK IF EMAIL ALREADY USED
    const {rows} = await db.query(`SELECT id FROM users WHERE email='${user.email}'`);
    
    if(rows.length !== 0) return 'Email already used.';

    return user;
};

const verifyCredentials = async (request,h) => {

    const user = request.payload;

    const { rows } = await db.query(`SELECT id,firstname,lastname,email,password,admin FROM users WHERE email='${user.email}'`);
    if(rows.length === 0) return 'Email not found.';

    const isValid = await bcrypt.compare(user.password,rows[0].password);
    if(!isValid)  return 'Invalid password.';
    
    return rows[0];
}

const validate = async (decoded,request,h) => {
    
    const { rows } = await db.query(`SELECT id,firstname,lastname,email,password,admin FROM users WHERE id='${decoded.id}'`);

    if(rows === 0) {
        return {isValid : false};
    }
    else {
        return {isValid:true};
    };

};


module.exports = {verifyUniqueEmail: verifyUniqueEmail, verifyCredentials:verifyCredentials, validate:validate};
