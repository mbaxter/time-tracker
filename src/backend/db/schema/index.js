"use strict";
const Connection = require("../connection");
const tables = require("./table-definitions");
const foreignKeys = require('./foreign-keys');
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
        foreignKeys(this.getTables());
    }

    /**
     *
     * @param {string} name
     * @returns {Sequelize.Model}
     */
    getTable(name) {
        return connection.model(name);
    }

    getTables() {
        return connection.models;
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
     * Creates a transaction.
     * @param {function|object} callbackOrOptions If a function is provided, a managed transaction is initiated. The
     * callback passed the transaction and is expected to return a promise.  If the promise resolves, the transaction
     * is committed. Otherwise, the transaction is rolled back.
     * If no value is passed or an options object is given, an unmanaged transaction is
     * started.  The method returns a promise that resolves to the transaction object.
     * @returns {Promise.<Sequelize.Transaction>}
     */
    createTransaction(callbackOrOptions) {
        return connection.transaction(callbackOrOptions);
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