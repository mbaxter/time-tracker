"use strict";
const Sequelize = require("sequelize");
const DateTimeFormatter = require('../../../../shared/datetime/format/date-time-formatter');

const timeBlockDefinition = {};
timeBlockDefinition.fields = {
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

timeBlockDefinition.instanceMethods = {
    'toJSON' : function() {
        return {
            id: this.id,
            user_id: this.user_id,
            start: DateTimeFormatter.normalizeDate(this.start),
            end: DateTimeFormatter.normalizeDate(this.end)
        };
    }
};

module.exports = timeBlockDefinition;