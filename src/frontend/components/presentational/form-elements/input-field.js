"use strict";

const React = require('react');
const Label = require('./field-label');
const FieldError = require('./field-error');
const noop = require('lodash/noop');

class FormField extends React.Component {
    render() {
        const props = this.props;
        return (
            <div className={this._getClassNameWithError("form-group")}>
                <Label htmlFor={props.name} className={this._getClassNameWithError()}>{props.label}</Label>
                <input type={props.type} className="form-control" name={props.name}
                       placeholder={props.placeholder} value={props.value} onChange={this._getOnChangeHandler()}/>
                <FieldError error={props.error}/>
            </div>
        );
    }

    _getOnChangeHandler() {
        return (e) => {
            const fieldName = e.target.name;
            const value = e.target.value;
            this.props.onChange(fieldName, value);
        };
    }

    _getClassNameWithError(className = "") {
        return this.props.error ? `has-error ${className}` : className;
    }
}

FormField.propTypes = {
    error: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.string
};

FormField.defaultProps = {
    onChange: noop,
    required: false,
    type: "text",
    value: ''
};

module.exports = FormField;