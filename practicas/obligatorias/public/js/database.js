'use strict'

const config = require('./config'); // sacar de public ?
const mysql = require ('mysql');

const pool = mysql.createPool({
    host    : config.host,
    user    : config.user,
    password: config.password,
    database: config.database
});


module.exports=pool;

