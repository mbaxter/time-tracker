"use strict";
const $ = require('jquery');
const React = require('react');
const SubmitBtn = require('./form-elements/submit-button');
const InputField = require('./form-elements/input-field');
const RequiredHelpBlock = require('./form-elements/required-help-block');
const FormError = require('./form-elements/form-error');
const UserRole = require('../../../shared/constants/user-role');
const values = require('lodash/values');
const noop = require('lodash/noop');
const isEmpty = require('lodash/isEmpty');

class UserForm extends React.Component {
    render() {
        const props = this.props;
        return (
            <div>
                <form action="" onSubmit={this._getOnSubmitHandler()} method="POST">
                    <fieldset disabled={props.disabled}>
                        <InputField name="email_address"
                                    value={props.fields.email_address}
                                    label="Email Address"
                                    error={props.fieldErrors.email_address}
                                    required={true}
                                    type="text"
                                    onChange={props.onChange}/>
                        <InputField name="password"
                                    value={props.fields.password}
                                    label="Password"
                                    error={props.fieldErrors.password}
                                    required={true}
                                    type="password"
                                    onChange={props.onChange}/>
                        <RequiredHelpBlock/>
                        <FormError error={props.error}/>
                        <SubmitBtn>{props.submitText}</SubmitBtn>
                    </fieldset>
                </form>
            </div>
        );
    }

    _getOnSubmitHandler() {
        return (e) => {
            e.preventDefault();
            const fields = $(e.target).toJSON();
            this.props.onSubmit(fields);
        };
    }

    _getClassNameWithError(className = "") {
        return this._hasError() ? `has-error ${className}` : className;
    }

    _hasError() {
        return this.props.error || !isEmpty(this.props.fieldErrors);
    }
}

UserForm.propTypes = {
    disabled: React.PropTypes.bool,
    error: React.PropTypes.string,
    fields: React.PropTypes.shape({
        email_address: React.PropTypes.string,
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string,
        role: React.PropTypes.oneOf(values(UserRole)),
        timezone: React.PropTypes.string
    }),
    fieldErrors: React.PropTypes.shape({
        email_address: React.PropTypes.string,
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string,
        role: React.PropTypes.string,
        timezone: React.PropTypes.string
    }),
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func.isRequired,
    submitText: React.PropTypes.string.isRequired,
};

UserForm.defaultProps = {
    disabled: false,
    error: "",
    fields: {},
    fieldErrors: {},
    onChange: noop,
    onSubmit: noop,
    submitText: "Submit"
};

module.exports = UserForm;