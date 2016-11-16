"use strict";
const ActionType = require('../../../constants/action-types');

const batchPullByName = (state = {pending: false, offset: 0, finished: false, lastPulled: 0}, action) => {
    switch (action.type) {
        case ActionType.BATCH_PULL_START:
            return {
                ... state,
                pending: true
            };
        case ActionType.BATCH_PULL_FAIL:
            return {
                ... state,
                pending: false
            };
        case ActionType.BATCH_PULL_SUCCESS:
            return {
                ... state,
                pending: false,
                finished: action.finished,
                offset: state.offset + action.chunkSize,
                lastPulled: Date.now()
            };
        default:
            return state;
    }
};

const batchPull = (state = {}, action) => {
    switch (action.type) {
        case ActionType.CLEAR_CREDENTIALS:
            return {};
        case ActionType.BATCH_PULL_START:
        case ActionType.BATCH_PULL_FAIL:
        case ActionType.BATCH_PULL_SUCCESS:
            return {
                ... state,
                [action.name]: batchPullByName(state[action.name], action)
            };
        default:
            return state;
    }
};

module.exports = batchPull;