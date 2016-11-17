"use strict";
const React = require('react');
const noop = require('lodash/noop');

const ButtonCreate = (props) => {
    return (
        <button className="btn btn-primary" onClick={props.onCreate}><i className="fa fa-plus"/> Create</button>
    );
};

ButtonCreate.propTypes = {
    onCreate: React.PropTypes.func
};

ButtonCreate.defaultProps = {
    onCreate: noop
};

module.exports = ButtonCreate;