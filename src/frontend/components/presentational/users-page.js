"use strict";
const React = require('react');
const UsersTable = require('../stateful/app-users-table');
const Modal = require('./modal/modal-wrapper');

const UsersPage = (props) => {
    return (
        <div>
            <Modal show={React.Children.count(props.children) > 0}>{props.children}</Modal>
            <h2>Manage Users</h2>
            <UsersTable />
        </div>
    );
};

UsersPage.propTypes = {
    children: React.PropTypes.node
};

module.exports = UsersPage;