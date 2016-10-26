"use strict";
const Sequelize = require('sequelize');

const createConnection = function() {
    return new Sequelize(process.env.API_DB_URL, {
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        timezone: "+00:00",
        logging: false
    });
};

const instance = createConnection();
module.exports.getInstance = function getInstance() {
    return instance;
};