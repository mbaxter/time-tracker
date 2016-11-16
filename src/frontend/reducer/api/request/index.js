"use strict";
const ActionType = require('../../../constants/action-types');

const requestByName = (state = {pending: false, lastRequestAt: 0}, action) => {
    switch (action.type) {
        case ActionType.API_REQUEST_START:
            return {
                ... state,
                pending: true
            };
        case ActionType.API_REQUEST_END:
            return {
                ... state,
                pending: false,
                lastRequestAt: Date.now(),
            };
        default:
            return state;
    }
};

const request = (state = {}, action) => {
    switch (action.type) {
        case ActionType.CLEAR_CREDENTIALS:
            return {};
        case ActionType.API_REQUEST_START:
        case ActionType.API_REQUEST_END:
            return {
                ... state,
                [action.name]: requestByName(state[action.name], action)
            };
        default:
            return state;
    }
};

module.exports = request;