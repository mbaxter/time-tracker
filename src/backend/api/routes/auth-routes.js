"use strict";
const UserCollection = require('../../db/collection/user');
const jwt = require('../../security/jwt');
const AuthResponseFactory = require('../response/auth-response-factory');

const AuthRoutes = {};

AuthRoutes.setPublicRoutes = function(router) {
    // Route for posting email, password that should return an auth token on success
    router.post('/auth/login', (req, res) => {
        const email = req.body.email_address || false;
        const password = req.body.password || false;

        if(!email || !password) {
            return AuthResponseFactory.emailOrPasswordMissing(res);
        }

        // Query for user matching email and password
        UserCollection.retrieveOneByEmailAddressAndPassword(email, password)
            .then((user) => {
                if(!user) {
                    return AuthResponseFactory.unauthorized(res);
                }

                return jwt.sign({
                    userId: user.id,
                    role: user.role
                }).then((jwtToken) => {
                    return AuthResponseFactory.authToken(res, jwtToken);
                });
            })
            .catch((err) => {
                return AuthResponseFactory.internalError(res, err);
            });
    });
};

AuthRoutes.setPrivateRoutes = function() {
    // No private routes
    return;
};

module.exports = AuthRoutes;