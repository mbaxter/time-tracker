"use strict";
const UserRole = require('./constants/user-role');
const Tables = require('./constants/tables');
const includes = require('lodash/includes');
const Permissions = {};

Permissions.canCreateOtherUsersRecords = function(role, table) {
    return Permissions._validTable(table) && role == UserRole.ADMIN;
};

Permissions.canReadOtherUsersRecords = function(role, table) {
    return Permissions._validTable(table) && role == UserRole.ADMIN;
};

Permissions.canUpdateOtherUsersRecords = function(role, table) {
    return Permissions._validTable(table) && role == UserRole.ADMIN;
};

Permissions.canDeleteOtherUsersRecords = function(role, table) {
    return Permissions._validTable(table) && role == UserRole.ADMIN;
};

Permissions._validTable = function(table) {
   return includes(Tables, table);
};

module.exports = Permissions;