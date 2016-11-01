"use strict";
const Schema = require('../schema');
const QueryOptionsBuilder = require('../query/query-options-builder');
const ValidationError = require('./error/validation-error');

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
        throw new Error(`[${this.name}] static tableName getter is not implemented`);
    }

    static get validator() {
        throw new Error(`[${this.name}] static validator getter is not implemented`);
    }

    static create() {
        return new this();
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

        const validationResult = records.map((record) => {
            const validator = this.constructor.validator;
            return validator.validateCreate(record);
        });

        const isValid = validationResult.reduce((accum, result) => accum && result.isValid, true);
        if (!isValid) {
            throw ValidationError.create(records, validationResult);
        }

        options = QueryOptionsBuilder.toObject(options);
        return this.model.bulkCreate(records, options);
    }

    /**
     * Private function for calling findAll sequelize method.
     * This is a good place to enforce required options like limits.
     * @param {object|QueryOptionsBuilder} options
     * @returns {Promise<*[]>}
     * @protected
     */
    _findAll(options) {
        options = QueryOptionsBuilder.toBuilder(options);
        options.enforceLimit();
        return this.model.findAll(options.getOptions());
    }
}

module.exports = AbstractCollection;