"use strict";

const RecordType = require('../constants/record-types');
const Api = require('./index.js');
const Promise = require('bluebird');

const BatchApi = {};

BatchApi.pullBatch = (recordType, {userId = null, limit = 1000, offset = 0} = {}) => {
   switch(recordType) {
       case RecordType.TIME_BLOCK:
           return Api.TimeBlocks.getUserRecords(userId, limit, offset);
       default:
           return Promise.reject(`Batch api not implemented for record type '${recordType}'`);
   }
};

BatchApi.setAuthToken = Api.setAuthToken;

module.exports = BatchApi;