"use strict";
const ReactRedux = require('react-redux');
const NavBar = require('../presentational/nav-bar');
const subject = require('../../selector/subject-selector');

const timePathTest = /^\/app(\/time-blocks.*)?$/;
const profilePathTest = /^\/app\/profile$/;
const publicPathTest = /^\/(login|signup)?$/;

const mapStateToProps = (state, ownProps) => {
    const authenticated = subject.authenticated(state);
    const navItemsLeft = [];
    const navItemsRight = [];

    const currentPath = ownProps.location;

    if (authenticated && !publicPathTest.test(currentPath)) {
        navItemsLeft.push({
            label: "Manage Time",
            url: "/app/time-blocks",
            active: timePathTest.test(currentPath)
        });
        navItemsLeft.push({
            label: "Profile",
            url: "/app/profile",
            active: profilePathTest.test(currentPath)
        });

        navItemsRight.push({
            label: "Log out",
            url: "/login",
            active: false
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