"use strict";
/**
 * This reducer manages ui state, like form field values, etc
 */
const ActionTypes = require('../../../constants/action-types');
const omit = require('lodash/omit');

const formField = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.FORM_FIELD_UPDATE:
            return {
                ... state,
                [action.fieldName]: action.fieldValue
            };
        default:
            return state;
    }
};

const formFields = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.CLEAR_CREDENTIALS:
            return {};
        case ActionTypes.CLEAR_FORM:
            return omit(state, action.formName);
        case ActionTypes.FORM_FIELD_UPDATE:
            return {
                ... state,
                [action.formName]: formField(state[action.formName], action)
            };
        default:
            return state;
    }
};

module.exports = formFields;
