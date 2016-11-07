"use strict";

const jwt = require('./jwt');

const UserJwt = {};

UserJwt.sign = function(user) {
    // See spec for standard fields: https://tools.ietf.org/html/rfc7519#section-4.1
    return jwt.sign({
        sub: user.email_address,
        userId: user.id,
        role: user.role,
        iat: Math.min(Date.now() / 1000)
    });
};

UserJwt.verify = jwt.verify;

module.exports = UserJwt;