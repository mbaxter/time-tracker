"use strict";
const React = require('react');
const NavBar = require('./nav-bar');

class App extends React.Component {
    render() {
        return (
            <div>
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