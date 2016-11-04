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
}

module.exports = TimeBlocksApi;