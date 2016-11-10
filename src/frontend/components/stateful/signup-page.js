"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const ReactRouter = require('react-router');
const UserForm = require('../presentational/user-form');
const actions = require('../../actions');
const PageNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const get = require('lodash/get');

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
    const fields = get(state, `ui.formFields.${PageNames.SIGNUP}`, {});
    const error = get(state, `request.formSubmissions.${PageNames.SIGNUP}.error`,"");
    const fieldErrors = get(state, `request.formSubmissions.${PageNames.SIGNUP}.fieldErrors`,{});
    const requestStatus = get(state, `request.formSubmissions.${PageNames.SIGNUP}.status`);
    return {
        fields,
        fieldErrors,
        error,
        disabled: requestStatus == RequestStatus.PENDING
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (fieldName, value) => {
            dispatch(actions.updateFormField(PageNames.SIGNUP, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.signup(formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupPage);

