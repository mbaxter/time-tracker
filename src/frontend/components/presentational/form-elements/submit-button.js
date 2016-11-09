"use strict";
const React = require('react');

const SubmitBtn = (props) => {
    return (
        <button type="submit" className="btn btn-primary">{props.children}</button>
    );
};

SubmitBtn.propTypes = {
    children: React.PropTypes.node.isRequired
};

SubmitBtn.defaultProps = {
    children: "Submit"
};

module.exports = SubmitBtn;