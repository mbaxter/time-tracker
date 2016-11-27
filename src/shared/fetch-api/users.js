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

    updateRecord(id, fields) {
        return this.patch(`/users/${id}`, fields);
    }

    getRecords(limit = 1000, offset = 0) {
        return this.get(`/users?limit=${limit}&offset=${offset}`);
    }

    deleteRecord(id) {
        return this.del(`/users/${id}`);
    }

    getCurrentUser() {
        return this.get("/users/me");
    }
}

module.exports = UsersApi;