"use strict";
const React = require('react');

const ResetBtn = (props) => {
    return (
        <button type="reset" className="btn btn-default">{props.children}</button>
    );
};

ResetBtn.propTypes = {
    children: React.PropTypes.node.isRequired
};

ResetBtn.defaultProps = {
    children: "Clear"
};

module.exports = ResetBtn;