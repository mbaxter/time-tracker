"use strict";
const React = require('react');
const ReactRouter = require('react-router');

const Link = ReactRouter.Link;
const PropTypes = React.PropTypes;

class NavBar extends React.Component {
    render() {
        return (
            <nav id="navbar" className="navbar navbar-default navbar-static-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <div className="navbar-brand">Time Tracker</div>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        {this.props.navItemsLeft.map(this._renderNavItem)}
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        {this.props.navItemsRight.map(this._renderNavItem)}
                    </ul>
                </div>
            </div>
        </nav>
        );
    }

    _renderNavItem(navItem, index) {
       return (
           <li key={index}><Link to={navItem.url}>{navItem.label}</Link></li>
       );
    }
}

const navItemType = PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
}).isRequired;

NavBar.propTypes = {
    navItemsLeft: PropTypes.arrayOf(navItemType).isRequired,
    navItemsRight: PropTypes.arrayOf(navItemType).isRequired
};

NavBar.defaultProps = {
    navItemsLeft: [],
    navItemsRight: []
};

module.exports = NavBar;