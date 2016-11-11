"use strict";
require('../css/alerts.css');
const React = require('react');
const Alert = require('../presentational/alert');
const omit = require('lodash/omit');

const Alerts = (props) => {
    return (
        <div className="alerts">
            {props.alerts.map((alert) => {
                return (
                    <Alert key={alert.id} {... omit(alert, 'created')} onDismiss={props.onDismiss}>{alert.message}</Alert>
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
        fade: React.PropTypes.bool,
        created: React.PropTypes.number
    })).isRequired,
    onDismiss: React.PropTypes.func
};

module.exports = Alerts;