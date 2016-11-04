"use strict";
const cls = require('continuation-local-storage');
const clsBluebird = require('cls-bluebird');
const Sequelize = require('sequelize');
/**
 * Setup a namespace so that managed transactions automatically pass the transaction parameter to all queries
 * See: http://docs.sequelizejs.com/en/latest/docs/transactions/#automatically-pass-transactions-to-all-queries
 */
const namespace = cls.createNamespace('time-tracker');
clsBluebird(namespace);
Sequelize.cls = namespace;

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