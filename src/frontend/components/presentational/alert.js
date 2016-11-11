"use strict";
require('../css/fx/fade.css');
const React = require('react');
const AlertTypes = require('../../constants/alert-types');
const values = require('lodash/values');
const noop = require('lodash/noop');

const Alert = (props) => {

    let alertClass, prefix;
    prefix = "";
    switch (props.type) {
        case AlertTypes.ERROR:
            alertClass = "alert-danger";
            prefix = "Error:";
            break;
        case AlertTypes.WARNING:
            alertClass = "alert-warning";
            prefix = "Warning:";
            break;
        case AlertTypes.SUCCESS:
            prefix = "Success:";
            alertClass = "alert-success";
            break;
        case AlertTypes.INFO:
        default:
            prefix = "Info:";
            alertClass = "alert-info";
            break;
    }

    return (
        <div className={`alert ${alertClass} ${props.fade ? 'fade-out' : ''} alert-dismissible`} role="alert">
            <button type="button" className="close" aria-label="Close" onClick={() => props.onDismiss(props.id)}><span aria-hidden="true">&times;</span></button>
            <strong>{prefix}</strong>
            {" "}
            {props.children}
        </div>
    );
};

Alert.propTypes = {
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    fade: React.PropTypes.bool,
    type: React.PropTypes.oneOf(values(AlertTypes)),
    onDismiss: React.PropTypes.func
};

Alert.defaultProps = {
    fade: false,
    type: AlertTypes.INFO,
    onDismiss: noop
};

module.exports = Alert;
