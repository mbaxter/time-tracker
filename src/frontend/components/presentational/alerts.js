"use strict";
const React = require('react');
const Alert = require('../presentational/alert');

const Alerts = (props) => {
    return (
        <div>
            {props.alerts.map((alert) => {
                return (
                    <Alert key={alert.id} id={alert.id} type={alert.type} onDismiss={props.onDismiss}>{alert.message}</Alert>
                );
            })}
        </div>
    );
};

Alerts.propTypes = {
    alerts: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        message: React.PropTypes.string,
        created: React.PropTypes.number
    })).isRequired,
    onDismiss: React.PropTypes.func
};

module.exports = Alerts;