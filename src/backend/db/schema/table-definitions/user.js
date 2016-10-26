"use strict";
const Sequelize = require("sequelize");
const UserRole = require('../../../../shared/constants/user-role');

const userDefinition = {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    email_address: {
        type: Sequelize.STRING,
        field: 'email_address',
        allowNull: false,
        unique: 'email_unique'
    },
    password: {
        type: Sequelize.STRING,
        field: 'password',
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    last_name: {
        type: Sequelize.STRING,
        field: 'last_name'
    },
    role: {
        type: Sequelize.INTEGER,
        field: 'role',
        allowNull: false,
        default: UserRole.STANDARD
    },
    timezone: {
        type: Sequelize.STRING,
        field: 'time_zone',
        allowNull: false,
        // See require('moment-timezone').tz.names() for timezone options
        default: "UTC"
    },
};

module.exports = userDefinition;

