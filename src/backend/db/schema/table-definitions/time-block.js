"use strict";
const Sequelize = require("sequelize");

const timeBlockDefinition = {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        field: 'user_id',
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        },
        onDelete: 'CASCADE'
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