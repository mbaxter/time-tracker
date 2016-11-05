"use strict";

const jwt = require('./jwt');
const DateTimeFormatter = require('../../shared/datetime/format/date-time-formatter');

const UserJwt = {};

UserJwt.sign = function(user) {
   return jwt.sign({
       userId: user.id,
       role: user.role,
       issued: DateTimeFormatter.normalizeDate(new Date())
   });
};

UserJwt.verify = jwt.verify;

module.exports = UserJwt;