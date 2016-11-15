"use strict";
const ActionType = require('../../../constants/action-types');

const singletonByName = (state = {pending: false, lastRequestAt: 0}, action) => {
    switch (action.type) {
        case ActionType.SINGLETON_REQUEST_START:
            return {
                ... state,
                pending: true
            };
        case ActionType.SINGLETON_REQUEST_END:
            return {
                ... state,
                pending: false,
                lastRequestAt: Date.now(),
            };
        default:
            return state;
    }
};

const singleton = (state = {}, action) => {
    switch (action.type) {
        case ActionType.SINGLETON_REQUEST_START:
        case ActionType.SINGLETON_REQUEST_END:
            return {
                ... state,
                [action.name]: singletonByName(state[action.name], action)
            };
        default:
            return state;
    }
};

module.exports = singleton;