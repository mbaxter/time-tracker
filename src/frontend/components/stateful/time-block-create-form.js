"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockForm = require('../presentational/time-block-form');
const actions = require('../../actions');
const FormNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const subjectSelector = require('../../selector/subject-selector');

const TimeBlockCreateForm = (props) => {
    return (
        <div>
            <TimeBlockForm {... props} submitText={"Create"}/>
        </div>
    );
};

const mapStateToProps = (state) => {
    const fields = subjectSelector.formFields(FormNames.TIME_BLOCK_CREATE, state);
    const currentUser = subjectSelector.currentUser(state) || {};
    const timezone = currentUser.timezone || 'UTC';

    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.TIME_BLOCK_CREATE, state);

    return {
        fields,
        fieldErrors,
        timezone,
        error,
        disabled: status == RequestStatus.PENDING
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (fieldName, value) => {
            dispatch(actions.sync.updateFormField(FormNames.TIME_BLOCK_CREATE, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.async.createTimeBlock(formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeBlockCreateForm);

