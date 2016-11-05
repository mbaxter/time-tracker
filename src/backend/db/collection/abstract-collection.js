"use strict";
const Schema = require('../schema');
const QueryOptionsBuilder = require('../query/query-options-builder');
const ValidationError = require('./error/validation-error');
const Promise = require('bluebird');
const NotImplementedError = require('../../error/method-not-implemented-error');
const first = require('lodash/first');
const defaults = require('lodash/defaults');
const omit = require('lodash/omit');

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

    get name() {
        return this.model.name;
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
     * Updates an instance
     * @param {Instance} record
     * @param {Object} data Key-value pairs of fields to update
     * @returns {Promise.<Instance>}
     */
    updateRecord(record, data) {
        return Promise.try(() => {
            const fullUpdate = defaults(data, omit(record.toJSON(), ['id','created_at', 'updated_at']));
            this._validateUpdate([fullUpdate]);
            return this._preprocessUpsert([data]);
        }).then(([data]) => {
            return record.update(data);
        });
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

    retrieveOneById(id, options = {}) {
        options = QueryOptionsBuilder.toBuilder(options);
        options = options.where('id', id);
        options = options.limit(1);

        return this._findAll(options)
            .then((records) => {
                return first(records);
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

    retrieveAll(options = {}, limit = 1000, offset = 0) {
        options = QueryOptionsBuilder.toBuilder(options);
        options = options.limit(limit, offset);

        return this._findAll(options);
    }

    /**
     * Utility method for getting back all records from a table
     * This should never be used in production
     */
    dangerouslyRetrieveAll() {
        return this.model.findAll();
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

    _validate(records, forCreation) {
        const validationResult = records.map((record) => {
            const validator = this.constructor.validator;
            return validator.validate(record, forCreation);
        });

        const isValid = validationResult.reduce((accum, result) => accum && result.isValid, true);
        if (!isValid) {
            throw ValidationError.create(records, validationResult);
        }
        return validationResult;
    }

    _validateCreate(records) {
        return this._validate(records, true);
    }

    _validateUpdate(records) {
        return this._validate(records, false);
    }

    /**
     * Private function for calling findAll sequelize method.
     * This is a good place to enforce required options like limits.
     * @param {Object|QueryOptionsBuilder} options
     * @returns {Promise<Object[]>}
     * @protected
     */
    _findAll(options = {}) {
        options = QueryOptionsBuilder.toBuilder(options);
        options = options.enforceLimit();
        return this.model.findAll(options.getOptions());
    }
}

module.exports = AbstractCollection;