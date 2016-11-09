"use strict";

const React = require('react');
const Label = require('./field-label');
const FieldError = require('./field-error');
const noop = require('lodash/noop');
const map = require('lodash/map');
const values = require('lodash/values');

class SelectField extends React.Component {
    render() {
        const props = this.props;
        return (
            <div className={this._getClassNameWithError("form-group")}>
                <Label htmlFor={props.name} className={this._getClassNameWithError()} required={props.required}>{props.label}</Label>
                <select className="form-control" name={props.name} value={props.value}
                        onChange={this._getOnChangeHandler()} required={props.required}>
                    {this._renderOptions()}
                </select>
                <FieldError error={props.error}/>
            </div>
        );
    }

    _renderOptions() {
        const options = map(this.props.options, (optionValue, optionLabel) => {
            return (
                <option value={optionValue} key={optionLabel}>{optionLabel}</option>
            );
        });

        if(this.props.includeBlank) {
            options.unshift(<option key="blank"/>);
        }

        return options;
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

SelectField.propTypes = {
    error: React.PropTypes.string,
    includeBlank: React.PropTypes.bool,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    // Object mapping from displayName => value
    options: React.PropTypes.object,
    required: React.PropTypes.bool,
    value: React.PropTypes.any
};

SelectField.defaultProps = {
    includeBlank: true,
    onChange: noop,
    required: false,
    type: "text",
    value: ''
};

module.exports = SelectField;