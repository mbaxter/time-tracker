"use strict";
const ActionTypes = require('../../../../constants/action-types');

const dateFilterByName = (state = {filter: {}, fields: {}, error: ""}, action) => {
    switch(action.type) {
        case ActionTypes.DATE_FILTER_APPLY:
            return {
                filter: {
                    from: action.from,
                    to: action.to
                },
                fields: {
                    from: action.from,
                    to: action.to
                },
                error: ""
            };
        case ActionTypes.DATE_FILTER_APPLY_ERROR:
            return {
                ... state,
                error: action.error
            };
        case ActionTypes.DATE_FILTER_CLEAR:
            return {
                filter: {},
                fields: {},
                error: ""
            };
        case ActionTypes.DATE_FILTER_SET_FIELD:
            return {
                ... state,
                fields: {
                    ... state.fields,
                    [action.fieldName]: action.fieldValue
                }
            };
        default:
            return state;
    }
};

const dateFilter = (state = {}, action) => {
   switch(action.type) {
       case ActionTypes.CLEAR_CREDENTIALS:
           return {};
       case ActionTypes.DATE_FILTER_APPLY:
       case ActionTypes.DATE_FILTER_APPLY_ERROR:
       case ActionTypes.DATE_FILTER_CLEAR:
       case ActionTypes.DATE_FILTER_SET_FIELD:
           return {
               ... state,
               [action.name]: dateFilterByName(state[action.name], action)
           };
       default:
           return state;
   }
};

module.exports = dateFilter;