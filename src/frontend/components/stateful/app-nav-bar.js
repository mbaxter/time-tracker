"use strict";
const ReactRedux = require('react-redux');
const NavBar = require('../presentational/nav-bar');
const subject = require('../../selector/subject-selector');

const timeTest = /^\/app(\/time-blocks.*)?$/;

const mapStateToProps = (state, ownProps) => {
   const authenticated = subject.authenticated(state);
    const navItemsLeft = [];
    const navItemsRight = [];

    const currentPath = ownProps.location;

    if (authenticated) {
       navItemsLeft.push({
           label: "Manage Time",
           url: "/app/time-blocks",
           active: timeTest.test(currentPath)
       });
    }
    return {
        navItemsLeft,
        navItemsRight
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(NavBar);