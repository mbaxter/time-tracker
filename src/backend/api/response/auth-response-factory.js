"use strict";

const ResponseFactory = require('./response-factory');
const clone = require('lodash/clone');
const httpCodes = require('http-status-codes');

const AuthResponseFactory = clone(ResponseFactory);

AuthResponseFactory.authToken = function(res, jwtToken) {
    return res.status(httpCodes.OK).json({
        token: jwtToken
    });
};

AuthResponseFactory.invalidCredentials = function(res) {
    return res.status(httpCodes.UNAUTHORIZED).json({
        error: "Invalid credentials."
    });
};

AuthResponseFactory.emailOrPasswordMissing = function(res) {
    return res.status(httpCodes.BAD_REQUEST).json({
        error: "Email and password are required."
    });
};

AuthResponseFactory.unauthorized = function(res) {
   return res.status(httpCodes.UNAUTHORIZED).end();
};

module.exports = AuthResponseFactory;