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

const LoginPage = (props) => {
    return (
        <div>
            <h2>Login (or <Link to="/signup">Sign Up</Link>)</h2>
            <UserForm {... props} submitText={"Login"} includeFields={['email_address','password']}/>
        </div>
    );
};

const mapStateToProps = (state) => {
   const fields = get(state, `ui.formFields.${PageNames.LOGIN}`, {});
    const error = get(state, `request.formSubmissions.${PageNames.LOGIN}.error`,"");
    const fieldErrors = get(state, `request.formSubmissions.${PageNames.LOGIN}.fieldErrors`,{});
    const requestStatus = get(state, `request.formSubmissions.${PageNames.LOGIN}.status`);
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
          dispatch(actions.updateFormField(PageNames.LOGIN, fieldName, value));
       },
       onSubmit: (formData) => {
           dispatch(actions.login(formData.email_address, formData.password));
       }
   };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);

