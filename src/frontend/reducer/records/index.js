"use strict";
const ActionTypes = require('../../constants/action-types');
const keyBy = require('lodash/keyBy');

const recordType = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.APPEND_RECORDS:
            return {
                ... state,
                ... keyBy(action.records, 'id')
            };
        default:
            return state;
    }
};

const record = (state = {}, action) => {
     switch(action.type) {
         case ActionTypes.CLEAR_CREDENTIALS:
             return {};
         case ActionTypes.APPEND_RECORDS:
             return {
                 ... state,
                 [action.recordType] : recordType(state[action.recordType], action)
             };
         default:
             return state;
     }
};

module.exports = record;