'use strict';

const db = require('../db');

async function verifyUniqueEmail(req,res) {

    const user = req.payload;
    
    // CHECK IF EMAIL ALREADY USED
    const {rows} = await db.query(`SELECT id FROM users WHERE email='${user.email}'`);
    
    if(rows.length !== 0) return 'Email already used.';

    return user;
}

module.exports = {verifyUniqueEmail: verifyUniqueEmail};
