"use strict";
const ActionTypes = require('../../constants/action-types');
const RequestStatus = require('../../constants/request-status');

const batchPullForType = (state = {offset: 0, batchSize: 0, done: false}, action) => {
    switch(action.type) {
        case ActionTypes.BATCH_PULL_START:
            return {
                offset: 0,
                batchSize: action.batchSize,
                status: RequestStatus.PENDING,
                done: false
            };
        case ActionTypes.BATCH_PULL_PROGRESS:
            return {
                offset: state.offset + action.count,
                done: (action.count < state.batchSize)
            };
        case ActionTypes.BATCH_PULL_SUCCESS:
            return {
                ... state,
                status: RequestStatus.SUCCESSFUL
            };
        case ActionTypes.BATCH_PULL_FAIL:
            return {
                ... state,
                status: RequestStatus.FAILED
            };
        default:
            return state;
    }
};

const batchPull = (state = {}, action) => {
   switch(action.type) {
       case ActionTypes.BATCH_PULL_START:
       case ActionTypes.BATCH_PULL_PROGRESS:
       case ActionTypes.BATCH_PULL_SUCCESS:
       case ActionTypes.BATCH_PULL_FAIL:
           return {
               ... state,
               [action.name]: batchPullForType(state[action.name], action)
           };
       default:
           return state;
   }
};

module.exports = batchPull;