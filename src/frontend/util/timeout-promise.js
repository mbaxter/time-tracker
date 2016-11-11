"use strict";
const Promise = require('bluebird');

module.exports = function(milliseconds) {
   return new Promise((resolve) => {
       setTimeout(resolve, milliseconds);
   });
};