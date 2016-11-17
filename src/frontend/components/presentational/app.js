"use strict";
const React = require('react');
const NavBar = require('../stateful/app-nav-bar');
const Loader = require('../stateful/app-loader');
const AppAlerts = require('../stateful/app-alerts');

class App extends React.Component {
    render() {
        return (
            <div>
                <Loader/>
                <NavBar location={this.props.location.pathname}/>
                <div className="container">
                    <AppAlerts />
                    {this.props.children}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.shape({
        pathname: React.PropTypes.string.isRequired
    }).isRequired
};

module.exports = App;