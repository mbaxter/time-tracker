"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const actions = require('../../actions');
const subjectSelector = require('../../selector/subject-selector');
const appDataFetched = require('../../selector/app-data-fetched');

class TimeTrackerApp extends React.Component {
    constructor(props) {
        super(props);
        this._fetchTimeout = false;
        this._fetching = false;
    }

    componentDidMount() {
        this._manageFetching(this.props.shouldFetch);
    }

    componentWillReceiveProps(nextProps) {
        this._manageFetching(nextProps.shouldFetch);
    }

    componentWillUnmount() {
        // Make sure we clean up the loader state
        this._cleanupFetching();
    }

    _manageFetching(shouldFetch) {
        // Show / hide loader as the shouldFetch state changes
        if (!this._fetching && shouldFetch) {
            this._fetching = true;
            this.props.dispatch(actions.showLoader());
        } else if (this._fetching && !shouldFetch) {
            this._fetching = false;
            this.props.dispatch(actions.hideLoader());
        }

        // Fetch app data
        if (shouldFetch && !this._fetchTimeout) {
            this._fetchData();
        }
    }

    _cleanupFetching() {
        if (this._fetching) {
            this._fetching = false;
            this.props.dispatch(actions.hideLoader());
            clearTimeout(this._fetchTimeout);
            this._fetchTimeout = false;
        }
    }

    _fetchData() {
        this.props.dispatch(actions.fetchAppData());
        if (this.props.shouldFetch) {
            // Try fetching again after a delay
            this._fetchTimeout = setTimeout(() => this._fetchData(), 150);
        } else {
            this._fetchTimeout = false;
        }
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
    isAuthenticated: React.PropTypes.bool.isRequired,
    shouldFetch: React.PropTypes.bool.isRequired
};

TimeTrackerApp.defaultProps = {
    isAuthenticated: false,
    shouldFetch: false
};

const mapStateToProps = (state) => {
    const isAuthenticated = subjectSelector.authenticated(state);
    const shouldFetch = isAuthenticated && !appDataFetched(state);
    return {isAuthenticated, shouldFetch};
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(TimeTrackerApp);