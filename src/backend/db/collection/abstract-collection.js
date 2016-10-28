"use strict";
const Schema = require('../schema');
const QueryOptionsBuilder = require('../query/query-options-builder');

class AbstractCollection {
    constructor() {
        const tableName = this.constructor.tableName;
        this.model = Schema.getInstance().getTable(tableName);
    }

    /**
     * @abstract
     * Return the name of this table
     * @return {string}
     */
    static get tableName() {
        throw new Error(`[${this.name}] static tableName() method not implemented`);
    }

    static create() {
        return new this.constructor();
    }

    getAllFields() {
        return Object.keys(this.model.attributes);
    }

    /**
     *
     * @param {object|object[]} records A single record or set of records to upsert
     * @param {QueryOptionsBuilder|object} options Sequelize query options
     * @returns {Promise<*[]>|Promise.<Array.<*>>}
     */
    upsert(records, options = {}) {
        if (!Array.isArray(records)) {
            // If we were passed a single value, wrap it in an array
            records = [records];
        }

        options = QueryOptionsBuilder.toObject(options);
        return this.model.bulkCreate(records, options);
    }
}

module.exports = AbstractCollection;