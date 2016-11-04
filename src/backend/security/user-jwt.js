"use strict";

const jwt = require('./jwt');

const UserJwt = {};

UserJwt.sign = function(user) {
   return jwt.sign({
       userId: user.id,
       role: user.role
   });
};

UserJwt.verify = jwt.verify;

module.exports = UserJwt;