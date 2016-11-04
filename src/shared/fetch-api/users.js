"use strict";

const FetchApi = require('./fetch-api');

class UsersApi extends FetchApi {
    /**
     * Submits a single record to be inserted
     * @param {Object} record
     * @returns {Promise.<Response>}
     */
    insertRecord(record) {
        return this.post("/users", record);
    }

    getCurrentUser() {
        return this.get("/users/me");
    }
}

module.exports = UsersApi;