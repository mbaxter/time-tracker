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

const Link = ReactRouter.Link;

const LoginPage = (props) => {
    return (
        <div>
            <h2>Login (or <Link to="/signup">Sign Up</Link>)</h2>
            <UserForm {... props} submitText={"Login"} includeFields={['email_address','password']}/>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    let fields = subjectSelector.formFields(FormNames.LOGIN, state);
    if (isEmpty(fields)) {
        // If no ui state exists, use the data from the url to populate fields
        // Grab email and password from the url if available
        fields = pick(ownProps.location.query || {}, ['email_address','password']);
    }
    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.LOGIN, state);

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
          dispatch(actions.sync.updateFormField(FormNames.LOGIN, fieldName, value));
       },
       onSubmit: (formData) => {
           dispatch(actions.async.login(formData.email_address, formData.password));
       }
   };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);

