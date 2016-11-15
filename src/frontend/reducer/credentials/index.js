"use strict";
const ActionTypes = require('../../constants/action-types');

const credentials = (state = {authenticated: false, token: null, userId: null}, action) => {
    switch (action.type) {
        case ActionTypes.AUTHORIZE:
            return {
                token: action.token,
                authenticated: true,
                userId: null
            };
        case ActionTypes.DEAUTHORIZE:
            return {
                token: null,
                authenticated: false,
                userId: null
            };
        case ActionTypes.SET_CURRENT_USER:
            return {
                ... state,
                userId: action.id
            };
        default:
            return state;
    }
};

module.exports = credentials;
