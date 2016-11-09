"use strict";
const React = require('react');

const FormError = (props) => {
    return (
        <p className="text-danger">{props.error}</p>
    );
};

FormError.propTypes = {
    error: React.PropTypes.string
};

module.exports = FormError;