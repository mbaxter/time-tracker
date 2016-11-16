"use strict";
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const options = {expiresIn: "2 hours"};

/**
 *
 * @param {Object} data
 * @returns {Promise.<string>} Promise resolves to the token
 */
module.exports.sign = function(data) {
    const sign = Promise.promisify(jwt.sign);
    return sign(data, process.env.SECRET, options);
};

/**
 *
 * @param {string} token
 * @return {Promise.<Object>} Promise resolves to the decoded payload
 */
module.exports.verify = function(token) {
    return new Promise(function(resolve, reject){
        if (!token) {
            return reject(new Error("No token provided"));
        }

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                reject(new Error("Invalid token"));
            } else {
                resolve(decoded);
            }
        });
    });
};