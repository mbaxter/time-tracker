"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const get = require('lodash/get');
const actions = require('../../actions');

class TimeTrackerApp extends React.Component {
    componentDidMount() {
        this.props.dispatch(actions.fetchUserData());
    }

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
    dispatch: React.PropTypes.func.isRequired,
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