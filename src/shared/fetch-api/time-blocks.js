"use strict";

const FetchApi = require('./fetch-api');

class TimeBlocksApi extends FetchApi {

    /**
     * Submits a single record to be inserted
     * @param {Object} record
     * @returns {Promise.<Response>}
     */
    insertRecord(record) {
        return this.post("/time-blocks", record);
    }

    updateRecord(id, fields) {
        return this.patch(`/time-blocks/${id}`, fields);
    }

    /**
     *
     * @param {int} userId
     * @param {int} limit
     * @param {int} offset
     * @returns {Promise.<Response>}
     */
    getUserRecords(userId, limit = 1000, offset = 0) {
        return this.get(`/users/${userId}/time-blocks?limit=${limit}&offset=${offset}`);
    }
}

module.exports = TimeBlocksApi;