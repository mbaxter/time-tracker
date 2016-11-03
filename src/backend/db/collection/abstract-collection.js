"use strict";
const Schema = require('../schema');
const QueryOptionsBuilder = require('../query/query-options-builder');
const ValidationError = require('./error/validation-error');
const Promise = require('bluebird');
const NotImplementedError = require('../../error/method-not-implemented-error');

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
        throw NotImplementedError.create(`${this.name}.tableName getter`);
    }

    /**
     * @abstract
     * @return {ModelValidator}
     */
    static get validator() {
        throw NotImplementedError.create(`${this.name}.validator getter`);
    }

    static create() {
        return new this();
    }

    getAllFields() {
        return Object.keys(this.model.attributes);
    }

    /**
     * Returns a count of all the records in this collection (constrained by any options where clauses).
     * @param {QueryOptionsBuilder|Object} options Sequelize query options
     * @returns {Promise<Int>}
     */
    count(options = {}) {
        return this.model.count(QueryOptionsBuilder.toObject(options));
    }

    /**
     *
     * @param {Object} record
     * @param {QueryOptionsBuilder|Object} options
     * @returns {Promise.<*>} Promise resolves to the inserted record
     */
    create(record, options) {
        return Promise.try(() => {
            this._validateCreate([record]);
            return this._preprocessUpsert([record]);
        }).then(([record]) => {
            return this.model.create(record, QueryOptionsBuilder.toObject(options));
        });
    }

    /**
     *
     * @param {Object|Object[]} records A single record or set of records to upsert
     * @param {QueryOptionsBuilder|Object} options Sequelize query options
     * @returns {Promise<*[]>|Promise.<Array.<*>>}
     */
    upsert(records, options = {}) {
        if (!Array.isArray(records)) {
            // If we were passed a single value, wrap it in an array
            records = [records];
        }

        return Promise.try(() => {
            this._validateCreate(records);
            return this._preprocessUpsert(records);
        }).then((records) => {
            options = QueryOptionsBuilder.toObject(options);
            return this.model.bulkCreate(records, options);
        });
    }

    /**
     * Stub that does not thing by default.
     * This is a place to modify records before upserting.
     * For example, you could hash plaintext passwords before inserting to the db.
     * @param {Object[]} records
     * @returns {Promise.<Object[]>}
     * @private
     */
    _preprocessUpsert(records) {
        return Promise.resolve(records);
    }

    _validateCreate(records) {
        const validationResult = records.map((record) => {
            const validator = this.constructor.validator;
            return validator.validateCreate(record);
        });

        const isValid = validationResult.reduce((accum, result) => accum && result.isValid, true);
        if (!isValid) {
            throw ValidationError.create(records, validationResult);
        }
        return validationResult;
    }

    /**
     * Private function for calling findAll sequelize method.
     * This is a good place to enforce required options like limits.
     * @param {Object|QueryOptionsBuilder} options
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