"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const ReactRouter = require('react-router');
const UserForm = require('../presentational/user-form');
const actions = require('../../actions');
const FormNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const subjectSelector = require('../../selector/subject-selector');

const Link = ReactRouter.Link;

const SignupPage = (props) => {
    return (
        <div>
            <h2>Sign Up (or <Link to="/login">Login</Link>)</h2>
            <UserForm {... props} submitText={"Sign Up"} excludeFields={['role']}/>
        </div>
    );
};

const mapStateToProps = (state) => {
    const fields = subjectSelector.formFields(FormNames.SIGNUP, state);
    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.SIGNUP, state);

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
            dispatch(actions.sync.updateFormField(FormNames.SIGNUP, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.async.signup(formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupPage);

