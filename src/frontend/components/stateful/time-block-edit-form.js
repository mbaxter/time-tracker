"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockForm = require('../presentational/time-block-form');
const actions = require('../../actions');
const FormNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const subjectSelector = require('../../selector/subject-selector');
const defaults = require('lodash/defaults');

const TimeBlockEditForm = (props) => {
    return (
        <div>
            <TimeBlockForm {... props} submitText={"Commit"}/>
        </div>
    );
};

TimeBlockEditForm.propTypes = {
    id: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    const formFields = subjectSelector.formFields(FormNames.TIME_BLOCK_EDIT, state);
    const timeBlocks = subjectSelector.timeBlocks(state);
    const recordFields = timeBlocks[ownProps.id] || {};
    const fields = defaults({}, formFields, recordFields);

    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.TIME_BLOCK_EDIT, state);

    return {
        fields,
        fieldErrors,
        error,
        disabled: status == RequestStatus.PENDING
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onChange: (fieldName, value) => {
            dispatch(actions.sync.updateFormField(FormNames.TIME_BLOCK_EDIT, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.async.editTimeBlock(ownProps.id, formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeBlockEditForm);

