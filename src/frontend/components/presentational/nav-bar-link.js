"use strict";
const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

const NavBarLink = (props) => {
    const className = props.active ? "active" : "";

    return (
        <li className={className}>
            <Link to={props.url} onClick={props.onClick}>
                {props.children}
            </Link>
        </li>
    );
};

NavBarLink.propTypes = {
    active: React.PropTypes.bool,
    children: React.PropTypes.node,
    url: React.PropTypes.string,
    onClick: React.PropTypes.func,
};

NavBarLink.defaultProps = {
    active: false
};

module.exports = NavBarLink;