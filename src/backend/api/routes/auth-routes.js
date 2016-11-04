"use strict";

const BaseRoutes = require('./base-routes');
const AuthResponseFactory = require('../response/auth-response-factory');
const UserCollection = require('../../db/collection/user');
const userJwt = require('../../security/user-jwt');

class AuthRoutes extends BaseRoutes {
    /**
     * Set public routes that do not require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setPublicRoutes(router) {
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
                        return AuthResponseFactory.invalidCredentials(res);
                    }

                    return userJwt.sign(user)
                        .then((jwtToken) => {
                            return AuthResponseFactory.authToken(res, jwtToken);
                        });
                })
                .catch((err) => {
                    return AuthResponseFactory.internalError(res, err);
                });
        });
    }
}

module.exports = AuthRoutes;