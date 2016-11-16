"use strict";
const ActionTypes = require('../../../constants/action-types');

const loader = (state = {requests: 0}, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_LOADER:
            return {
                requests: state.requests + 1
            };
        case ActionTypes.HIDE_LOADER:
            return {
                requests: state.requests - 1
            };
        default:
            return state;
    }
};

module.exports = loader;

