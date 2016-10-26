"use strict";
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const options = {expiresIn: "2 hours"};

module.exports.sign = function(data) {
   return jwt.sign(data, process.env.SECRET, options);
};

module.exports.verify = function(token) {
    return new Promise(function(resolve, reject){
        if (!token) {
            return reject("No token provided");
        }

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                reject("Invalid token");
            } else {
                resolve(decoded);
            }
        });
    });
};