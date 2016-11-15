"use strict";
const ActionTypes = require('../../constants/action-types');

const pendingRequest = (state = 0, action) => {
    switch(action.type) {
        case ActionTypes.INITIATE_REQUEST:
            return state + 1;
        case ActionTypes.RESOLVE_REQUEST:
            return state - 1;
        default:
            return state;

    }
};

const pendingRequests = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.INITIATE_REQUEST:
        case ActionTypes.RESOLVE_REQUEST:
            return {
                ... state,
                [action.name]: pendingRequest(state[action.name], action)
            };
        default:
            return state;

    }
};

module.exports = pendingRequests;