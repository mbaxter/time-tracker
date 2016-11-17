"use strict";
const ActionTypes = require('../../constants/action-types');
const keyBy = require('lodash/keyBy');
const omit = require('lodash/omit');

const recordType = (state = {}, action) => {
    let updated = {};

    switch(action.type) {
        case ActionTypes.DELETE_RECORD:
            return omit(state, action.id);
        case ActionTypes.APPEND_RECORDS:
            return {
                ... state,
                ... keyBy(action.records, 'id')
            };
        case ActionTypes.UPDATE_RECORD:
            if (state[action.id]) {
                updated[action.id] = {
                    ... state[action.id],
                    ... action.fields
                };
            }

            return {
                ... state,
                ... updated
            };
        default:
            return state;
    }
};

const record = (state = {}, action) => {
     switch(action.type) {
         case ActionTypes.CLEAR_CREDENTIALS:
             return {};
         case ActionTypes.DELETE_RECORD:
         case ActionTypes.APPEND_RECORDS:
         case ActionTypes.UPDATE_RECORD:
             return {
                 ... state,
                 [action.recordType] : recordType(state[action.recordType], action)
             };
         default:
             return state;
     }
};

module.exports = record;