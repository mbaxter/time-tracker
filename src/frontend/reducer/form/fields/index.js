"use strict";
/**
 * This reducer manages ui state, like form field values, etc
 */
const ActionTypes = require('../../../constants/action-types');

const formField = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.FORM_FIELD_UPDATE:
            return {
                ... state,
                [action.fieldName]: action.fieldValue
            };
        case ActionTypes.CLEAR_FORM:
            return {};
        default:
            return state;
    }
};

const formFields = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.FORM_FIELD_UPDATE:
        case ActionTypes.CLEAR_FORM:
            return {
                ... state,
                [action.formName]: formField(state[action.formName], action)
            };
        default:
            return state;
    }
};

module.exports = formFields;
