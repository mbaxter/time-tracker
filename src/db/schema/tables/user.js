"use strict";
const Sequelize = require("sequelize");

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
    time_zone: {
        type: Sequelize.STRING,
        field: 'time_zone',
        allowNull: false,
        default: "+00:00"
    },
};

module.exports = userDefinition;

