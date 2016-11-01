"use strict";
const Promise = require('bluebird');
const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 *
 * @param {string} plaintext
 * @return {Promise.<String>} Promise resolves to the hashed value
 */
module.exports.hash = function(plaintext) {
   return new Promise((resolve, reject) => {
       bcrypt.hash(plaintext, saltRounds, (err, hash) => {
           if (err) {
              return reject(err);
           }
           return resolve(hash);
       });
   });
};

/**
 * @param {string} plainText
 * @param {string} hash
 * @return {Promise.<boolean>} Resolves to a boolean indicating whether the plaintext and hashed values match
 */
module.exports.verify = Promise.promisify(bcrypt.compare);