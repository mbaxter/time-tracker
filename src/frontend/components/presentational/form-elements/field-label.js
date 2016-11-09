"use strict";
const React = require('react');

const FieldLabel = ({className, htmlFor, required, children}) => {
    return (
        <label {... {className,htmlFor}}>
            {children}
            {required && <sup className="text-danger">*</sup>}
        </label>
    );
};

FieldLabel.propTypes = {
    className: React.PropTypes.string,
    htmlFor: React.PropTypes.string,
    required: React.PropTypes.bool,
    children: React.PropTypes.node.isRequired
};

FieldLabel.defaultProps = {
    required: false,
    className: ""
};

module.exports = FieldLabel;