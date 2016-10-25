"use strict";
const Sequelize = require("sequelize");

const timeBlockDefinition = {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    start: {
        type: Sequelize.DATE,
        field: 'start',
        allowNull: false
    },
    end: {
        type: Sequelize.DATE,
        field: 'end',
        allowNull: false
    }
};

module.exports = timeBlockDefinition;