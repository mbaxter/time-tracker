"use strict";
const $ = require('jquery');
const React = require('react');
const SubmitBtn = require('./form-elements/button-submit');
const InputField = require('./form-elements/input-field-group');
const SelectField = require('./form-elements/select-field-group');
const RequiredHelpBlock = require('./form-elements/required-help-block');
const FormError = require('./form-elements/form-error');
const UserRole = require('../../../shared/constants/user-role');
const values = require('lodash/values');
const noop = require('lodash/noop');
const isEmpty = require('lodash/isEmpty');
const includes = require('lodash/includes');
const zipObject = require('lodash/zipObject');
const isUndefined = require('lodash/isUndefined');
const moment = require('moment-timezone');
const omit = require('lodash/omit');

const timezones = moment.tz.names();
class UserForm extends React.Component {
    render() {
        const props = this.props;
        return (
            <div>
                <form action="" onSubmit={this._getOnSubmitHandler()} method="POST">
                    <FormError error={props.error}/>
                    <fieldset disabled={props.disabled}>
                        {this._includeField("first_name") &&
                        <InputField name="first_name"
                                    value={props.fields.first_name}
                                    label="First Name"
                                    error={props.fieldErrors.first_name}
                                    required={false}
                                    type="text"
                                    onChange={props.onChange}/>
                        }
                        {this._includeField("last_name") &&
                        <InputField name="last_name"
                                    value={props.fields.last_name}
                                    label="Last Name"
                                    error={props.fieldErrors.last_name}
                                    required={false}
                                    type="text"
                                    onChange={props.onChange}/>
                        }
                        {this._includeField("email_address") &&
                        <InputField name="email_address"
                                    value={props.fields.email_address}
                                    label="Email Address"
                                    error={props.fieldErrors.email_address}
                                    required={true}
                                    type="text"
                                    onChange={props.onChange}/>
                        }
                        {this._includeField("password") &&
                        <InputField name="password"
                                    value={props.fields.password}
                                    label="Password"
                                    error={props.fieldErrors.password}
                                    required={!this.props.isForUpdate}
                                    type="password"
                                    placeholder={props.isForUpdate ? "*****" : undefined}
                                    onChange={props.onChange}/>
                        }
                        {this._includeField("timezone") &&
                        <SelectField name="timezone"
                                     value={props.fields.timezone || moment.tz.guess()}
                                     options={zipObject(timezones,timezones)}
                                     label="Timezone"
                                     error={props.fieldErrors.timezone}
                                     required={true}
                                     onChange={props.onChange}/>
                        }
                        {this._includeField("role") &&
                        <SelectField name="role"
                                     value={isUndefined(props.fields.role) ? UserRole.STANDARD : props.fields.role}
                                     options={zipObject(["Admin", "Standard"],[UserRole.ADMIN, UserRole.STANDARD])}
                                     label="Role"
                                     error={props.fieldErrors.role}
                                     required={true}
                                     onChange={props.onChange}/>
                        }
                        <RequiredHelpBlock/>
                        <SubmitBtn>{props.submitText}</SubmitBtn>
                    </fieldset>
                </form>
            </div>
        );
    }

    _includeField(name) {
        let included = includes(this.props.includeFields, name) || isEmpty(this.props.includeFields);
        let excluded = includes(this.props.excludeFields, name);

        return included && !excluded;
    }

    _getOnSubmitHandler() {
        return (e) => {
            e.preventDefault();
            let fields = $(e.target).toJSON();
            if (this.props.isForUpdate && !fields.password) {
               fields = omit(fields, 'password');
            }
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

const userFields = [
    "email_address",
    "password",
    "first_name",
    "last_name",
    "role",
    "timezone"
];
const createFieldShape = (propType) => {
    const fieldShape = {};
    userFields.forEach((field) => {
        fieldShape[field] = propType;
    });
    return React.PropTypes.shape(fieldShape);
};

UserForm.propTypes = {
    disabled: React.PropTypes.bool,
    error: React.PropTypes.string,
    fields: React.PropTypes.shape({
        email_address: React.PropTypes.string,
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string,
        role: React.PropTypes.oneOf(values(UserRole).concat(values(UserRole).map(String))),
        timezone: React.PropTypes.string
    }),
    fieldErrors: createFieldShape(React.PropTypes.string),
    isForUpdate: React.PropTypes.bool,
    excludeFields: React.PropTypes.arrayOf(React.PropTypes.oneOf(userFields)),
    includeFields: React.PropTypes.arrayOf(React.PropTypes.oneOf(userFields)),
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func.isRequired,
    submitText: React.PropTypes.string.isRequired,
};

UserForm.defaultProps = {
    disabled: false,
    error: "",
    excludeFields:[],
    includeFields:[],
    // If the form is for an update, password is obscured and the value
    // is only passed through to onSubmit if it is non-empty
    isForUpdate: false,
    fields: {},
    fieldErrors: {},
    onChange: noop,
    onSubmit: noop,
    submitText: "Submit"
};

module.exports = UserForm;