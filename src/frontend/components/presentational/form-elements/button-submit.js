"use strict";
const React = require('react');

const SubmitBtn = (props) => {
    return (
        <button type="submit" className={`btn ${props.className}`}>{props.children}</button>
    );
};

SubmitBtn.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node.isRequired
};

SubmitBtn.defaultProps = {
    children: "Submit",
    className: "btn-primary"
};

module.exports = SubmitBtn;