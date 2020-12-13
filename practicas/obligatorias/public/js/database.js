'use strict'

const config = require('./config');
const mysql = require ('mysql');

const pool = mysql.createPool({
    host    : config.host,
    user    : config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
});

module.exports=pool;

