"use strict";
const ActionTypes = require('../../../constants/action-types');
const AppConfig = require('../../../constants/app-configuration');

const pagingByName = (state = {offset: 0, pageSize: AppConfig.TABLE_PAGING_SIZE}, action) => {
    switch(action.type) {
        case ActionTypes.PAGING_GO_TO_PAGE:
            return {
                ... state,
                offset: (action.page - 1) * state.pageSize
            };
        default:
            return state;
    }
};

const paging = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.CLEAR_CREDENTIALS:
            return {};
        case ActionTypes.PAGING_GO_TO_PAGE:
            return {
                ... state,
                [action.name]: pagingByName(state[action.name], action)
            };
        default:
            return state;
    }
};

module.exports = paging;