"use strict";
const ActionTypes = require('../../constants/action-types');

const credentials = (state = {authenticated: false, token: null, userId: null, cleared: 0}, action) => {
    switch (action.type) {
        case ActionTypes.AUTHORIZE:
            return {
                ... state,
                token: action.token,
                authenticated: true,
                userId: null
            };
        case ActionTypes.CLEAR_CREDENTIALS:
            return {
                token: null,
                authenticated: false,
                userId: null,
                cleared: state.cleared + 1
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
