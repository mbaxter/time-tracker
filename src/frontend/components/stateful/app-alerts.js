"use strict";
const ReactRedux = require('react-redux');
const Alerts = require('../presentational/alerts');
const actions = require('../../actions');
const orderedAlerts = require('../../selector/ordered-alerts');

const mapStateToProps = (state) => {
    return {
        alerts: orderedAlerts(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: (alertId) => {
            dispatch(actions.sync.dismissAlert(alertId));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(Alerts);