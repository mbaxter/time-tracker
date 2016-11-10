"use strict";
const React = require('react');
const NavBar = require('./nav-bar');
const Loader = require('../stateful/app-loader');

class App extends React.Component {
    render() {
        return (
            <div>
                <Loader/>
                <NavBar/>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.node
};

module.exports = App;