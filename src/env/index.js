"use strict";
const nodeEnv = require("node-env-file");
const path = require("path");

const loadEnvironmentalVariablesFromConfig = function() {
    if (process.env.NODE_ENV != "production") {
        nodeEnv(path.join(__dirname, '../../.env'));
    }
    if (process.env.JAWSDB_URL && !process.env.API_DB_URL) {
        // Heroku mysql plugin sets db url to JAWSDB_URL
        // Move value to a more generically named env variable
        process.env.API_DB_URL = process.env.JAWSDB_URL;
    }
};

module.exports = loadEnvironmentalVariablesFromConfig;