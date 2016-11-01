"use strict";

const httpCodes = require('http-status-codes');
const jwt = require('../../security/jwt');
module.exports = function(req, res, next) {
    // Retrieve the token from the header
    const token = req.headers['x-access-token'];

    // Define function that handles unauthorized requests
    const unauthorized = (msg = "Invalid token.") => {
        return res.status(httpCodes.UNAUTHORIZED)
            .json({
                success: false,
                message: msg
            });
    };

    if (!token) {
        return unauthorized("No token provided.");
    }

    jwt.verify(token)
        .then((decoded) => {
            req.jwt = decoded;
            next();
        })
        .catch(() => {
            unauthorized();
        });
};