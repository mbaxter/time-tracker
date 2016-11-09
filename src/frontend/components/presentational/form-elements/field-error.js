"use strict";
const React = require('react');

const FieldError = (props) => {
   return (
       <span className="text-danger">{props.error}</span>
   );
};

FieldError.propTypes = {
    error: React.PropTypes.string
};

module.exports = FieldError;