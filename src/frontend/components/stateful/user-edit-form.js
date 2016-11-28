"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const UserForm = require('../presentational/user-form');
const actions = require('../../actions');
const FormNames = require('../../constants/form-names');
const RequestStatus = require('../../constants/request-status');
const subjectSelector = require('../../selector/subject-selector');
const defaults = require('lodash/defaults');

const UserEditForm = (props) => {
    return (
        <div>
            <UserForm {... props} submitText={"Save"}/>
        </div>
    );
};

UserEditForm.propTypes = {
    id: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    const formFields = subjectSelector.formFields(FormNames.USER_EDIT, state);
    const users = subjectSelector.users(state);
    const recordFields = users[ownProps.id] || {};
    const fields = defaults({}, formFields, recordFields);

    const {error, fieldErrors, status} = subjectSelector.formSubmission(FormNames.USER_EDIT, state);

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
            dispatch(actions.sync.updateFormField(FormNames.USER_EDIT, fieldName, value));
        },
        onSubmit: (formData) => {
            dispatch(actions.async.editUser(ownProps.id, formData));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(UserEditForm);

