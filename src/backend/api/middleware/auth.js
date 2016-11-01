"use strict";

const jwt = require('../../security/jwt');
const AuthResponseFactory = require('../response/auth-response-factory');

module.exports = function(req, res, next) {
    // Retrieve the token from the header
    const token = req.headers['x-access-token'];

    if (!token) {
        return AuthResponseFactory.unauthorized(res);
    }

    jwt.verify(token)
        .then((decoded) => {
            req.jwt = decoded;
            req.authorized = true;
            next();
        })
        .catch(() => {
            return AuthResponseFactory.unauthorized(res);
        });
};