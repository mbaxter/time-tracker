"use strict";

const FetchApi = require('./fetch-api');

class UsersApi extends FetchApi {
    /**
     * Posts a single user to the api for creation
     * @param {Object} user
     * @returns {Promise.<Response>}
     */
    postUser(user) {
        return this.post("/users", user);
    }
}

module.exports = UsersApi;