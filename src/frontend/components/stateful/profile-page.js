"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const ReactRouter = require('react-router');
const UserForm = require('../presentational/user-form');
const actions = require('../../actions');
const FormNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const pick = require('lodash/pick');
const subjectSelector = require('../../selector/subject-selector');
const isEmpty = require('lodash/isEmpty');
const defaults = require('lodash/defaults');

const ProfilePage = (props) => {
    return (
        <div>
            <h2>Profile</h2>
            <UserForm isForUpdate={true} {... props} submitText={"Update"} excludeFields={['role']}/>
        </div>
    );
};

const mapStateToProps = (state) => {
    const user = subjectSelector.currentUser(state);
    const formFields = subjectSelector.formFields(FormNames.PROFILE, state);
    const fields = defaults({}, formFields, user);

    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.PROFILE, state);

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
            dispatch(actions.sync.updateFormField(FormNames.PROFILE, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.async.updateProfile(formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePage);

