"use strict";

const FetchApi = require('./fetch-api');

class TimeBlockApi extends FetchApi {

    /**
     * Posts a single user to the api for creation
     * @param {Object} timeBlock
     * @returns {Promise.<Response>}
     */
    postTimeBlock(timeBlock) {
        return this.post("/time-blocks", timeBlock);
    }
}

module.exports = TimeBlockApi;