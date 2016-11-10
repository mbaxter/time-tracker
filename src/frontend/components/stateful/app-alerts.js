"use strict";
const ReactRedux = require('react-redux');
const Alerts = require('../presentational/alerts');
const actions = require('../../actions');
const reselect = require('reselect');
const get = require('lodash/get');
const values = require('lodash/values');
const orderBy = require('lodash/orderBy');

const alertsSelector = (state) => {
    return get(state, "ui.alerts", {});
};

const orderedAlertsSelector = reselect.createSelector(
    alertsSelector,
    (alerts) => {
        return orderBy(values(alerts), 'created');
    }
);

const mapStateToProps = (state) => {
    return {
        alerts: orderedAlertsSelector(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: (alertId) => {
            dispatch(actions.dismissAlert(alertId));
        }
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(Alerts);