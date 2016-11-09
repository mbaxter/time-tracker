"use strict";
const ActionTypes = require('../../constants/action-types');

const credentials = (state = {authenticated: false, token: null}, action) => {
    switch (action.type) {
        case ActionTypes.AUTHORIZE:
            return {
                token: action.token,
                authenticated: true
            };
        case ActionTypes.DEAUTHORIZE:
            return {
                token: null,
                authenticated: false
            };
        default:
            return state;
    }
};

module.exports = credentials;
