"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const UserForm = require('../presentational/user-form');
const actions = require('../../actions');
const FormNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const subjectSelector = require('../../selector/subject-selector');

const UserCreateForm = (props) => {
    return (
        <div>
            <UserForm {... props} submitText={"Create"}/>
        </div>
    );
};

const mapStateToProps = (state) => {
    const fields = subjectSelector.formFields(FormNames.USER_CREATE, state);

    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.USER_CREATE, state);

    return {
        fields,
        fieldErrors,
        error,
        disabled: status == RequestStatus.PENDING
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (fieldName, value) => {
            dispatch(actions.sync.updateFormField(FormNames.USER_CREATE, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.async.createUser(formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCreateForm);

