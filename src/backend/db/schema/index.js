"use strict";
const Connection = require("../connection");
const tables = require("./table-definitions");
const keys = require("lodash/keys");

const connection = Connection.getInstance();

class Schema {
    constructor() {
        this._createTables();
    }

    /**
     * @returns {Schema}
     */
    static create() {
        return new Schema();
    }

    _createTables() {
        for (let tableName of keys(tables)) {
            let definition = tables[tableName];
            connection.define(tableName, definition, {
                freezeTableName: true,
                underscored: true
            });
        }
    }

    /**
     *
     * @param {string} name
     * @returns {Sequelize.Model}
     */
    getTable(name) {
        return connection.model(name);
    }

    /**
     * Create our tables
     * @param {boolean} force
     * @returns {Promise}
     */
    sync(force = false) {
        return connection.sync({force: force});
    }

    /**
     * Force-create our tables
     * @returns {Promise}
     */
    forceSync() {
       return this.sync(true);
    }

    /**
     * Drop our tables
     * @returns {Promise}
     */
    drop() {
        return connection.drop();
    }
}

const schema = Schema.create();
module.exports.getInstance = function() {
    return schema;
};