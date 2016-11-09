"use strict";
const React = require('react');

const RequiredFieldLabel = ({className, htmlFor, required, children}) => {
    return (
        <label {... {className,htmlFor}}>
            {children}
            {required && <sup className="text-danger">*</sup>}
        </label>
    );
};

RequiredFieldLabel.propTypes = {
    className: React.PropTypes.string,
    htmlFor: React.PropTypes.string,
    required: React.PropTypes.bool,
    children: React.PropTypes.node.isRequired
};

RequiredFieldLabel.defaultProps = {
    required: false,
    className: ""
};

module.exports = RequiredFieldLabel;