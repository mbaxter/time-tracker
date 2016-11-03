"use strict";

const jwt = require('../../security/jwt');
const AuthResponseFactory = require('../response/auth-response-factory');

const tokenRegex = /Bearer (\w+)/i;

module.exports = function(req, res, next) {
    // Retrieve the token from the header
    // Token should be in the "Authorization" header in form "Bearer <token>"
    const authHeader = req.header['Authorization'] || '';
    const tokenMatches = authHeader.match(tokenRegex);
    const token = tokenMatches ? tokenMatches[1] : null;

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