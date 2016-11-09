"use strict";
const React = require('React');

const RequiredHelpBlock = () => {
    return (
        <p className="help-block"><sup className="text-danger">*</sup> Required Field</p>
    );
};

module.exports = RequiredHelpBlock;