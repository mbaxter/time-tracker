"use strict";

const BaseRouterFactory = require('./base-router-factory');
const AuthResponseFactory = require('../response/auth-response-factory');
const UserCollection = require('../../db/collection/user');
const jwt = require('../../security/jwt');

class AuthRouterFactory extends BaseRouterFactory {
    /**
     * Set public routes that do not require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setPublicRoutes(router) {
        // Route for posting email, password that should return an auth token on success
        router.post('/login', (req, res) => {
            const email = req.body.email_address || false;
            const password = req.body.password || false;

            if(!email || !password) {
                return AuthResponseFactory.emailOrPasswordMissing(res);
            }

            // Query for user matching email and password
            UserCollection.retrieveOneByEmailAddressAndPassword(email, password)
                .then((user) => {
                    if(!user) {
                        return AuthResponseFactory.invalidCredentials(res);
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
    }
}

module.exports = AuthRouterFactory;