"use strict";

const React = require('react');
const Label = require('./field-label');
const FieldError = require('./field-error');

class FieldGroup extends React.Component {
    render() {
        const props = this.props;
        return (
            <div className={this._getClassNameWithError("form-group")}>
                <Label className={this._getClassNameWithError()} required={props.required}>{props.label}</Label>
                <div>
                    {props.children}
                </div>
                <FieldError error={props.error}/>
            </div>
        );
    }

    _getClassNameWithError(className = "") {
        return this.props.error ? `has-error ${className}` : className;
    }
}

FieldGroup.propTypes = {
    children: React.PropTypes.node.isRequired,
    error: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    required: React.PropTypes.bool,
};

FieldGroup.defaultProps = {
    required: false
};

module.exports = FieldGroup;