"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const get = require('lodash/get');

class TimeTrackerApp extends React.Component {
    render() {
        if (!this.props.isAuthenticated) {
            return false;
        }

        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

TimeTrackerApp.propTypes = {
    children: React.PropTypes.node,
    isAuthenticated: React.PropTypes.bool
};

TimeTrackerApp.defaultProps = {
    isAuthenticated: false
};

const mapStateToProps = (state) => {
    const isAuthenticated = get(state, 'credentials.authenticated', false);
    return {isAuthenticated};
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(TimeTrackerApp);