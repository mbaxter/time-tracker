"use strict";
const clone = require('lodash/cloneDeepWith');
const Sequelize = require('sequelize');

/**
 * Builds options to pass to collections for querying
 */
class QueryOptionsBuilder {
    /**
     * @param {{}} options
     */
    constructor(options = {}) {
        this._options = options;
    }

    /**
     * @param {{}} options
     * @returns {QueryOptionsBuilder}
     */
    static create(options = {}) {
        return new QueryOptionsBuilder(options);
    }

    /**
     * Ensures the options are in raw object form
     * @param {QueryOptionsBuilder|{}} options
     * @return {object}
     */
    static toObject(options) {
        return (options instanceof QueryOptionsBuilder) ? options.getOptions() : options;
    }

    /**
     * Ensures the options are in builder form
     * @param {QueryOptionsBuilder|object} options
     * @returns {QueryOptionsBuilder}
     */
    static toBuilder (options) {
        return (options instanceof QueryOptionsBuilder) ? options : QueryOptionsBuilder.create(options);
    }

    getOptions() {
        return this._cloneOptions();
    }

    toJSON() {
        return this.getOptions();
    }

    limit(limit = 1000, offset = 0) {
        const options = this._cloneOptions();
        options.limit = parseInt(limit, 10) || 1000;
        options.offset = parseInt(offset,10) || 0;
        return QueryOptionsBuilder.create(options);
    }

    enforceLimit(limit = 1000) {
        limit = parseInt(limit, 10) || 1000;
        const options = this._cloneOptions();
        if (!options.limit || options.limit > limit) {
            options.limit = limit;
        }

        return QueryOptionsBuilder.create(options);
    }

    orderBy(fieldName, sortOrder = 'ASC') {
        const options = this._cloneOptions();
        if (!options.order) {
            options.order = [];
        }
        options.order.push([fieldName, sortOrder]);

        return QueryOptionsBuilder.create(options);
    }

    /**
     * Update query options to include the specified whereIn clause
     * @param {string} fieldName
     * @param {[]} fieldValues
     * @returns {QueryOptionsBuilder} Return a new builder with the whereIn update
     */
    whereIn(fieldName, fieldValues) {
        const options = this._cloneOptions();
        this._prepWhereUpdate(options);
        options.where[fieldName]= {$in: fieldValues};

        return QueryOptionsBuilder.create(options);
    }

    /**
     * Update query options to include the specified where clause
     * @param {string} fieldName
     * @param {[]} fieldValues
     * @returns {QueryOptionsBuilder} Return a new builder with the whereIn update
     */
    where(fieldName, fieldValue) {
        const options = this._cloneOptions();
        this._prepWhereUpdate(options);
        options.where[fieldName]= fieldValue;

        return QueryOptionsBuilder.create(options);
    }

    /**
     * Updates query options to exclude the given fields
     * @param {string[]} fields
     * @returns {QueryOptionsBuilder} Return a new builder with the modified options
     */
    excludeFields(fields) {
        fields = Array.isArray(fields) ? fields : [fields];
        const options = this._cloneOptions();
        this._prepAttributesUpdate(options);
        if (!options.attributes.exclude) {
            options.attributes.exclude = [];
        }
        fields.forEach((field) => {
            if (options.attributes.exclude.indexOf(field) == -1) {
                options.attributes.exclude.push(field);
            }
        });

        return QueryOptionsBuilder.create(options);
    }

    /**
     * Ensures that if no fields are explicitly included, these fields are included as a default
     * @param {string[]} fields
     * @returns {QueryOptionsBuilder} Return a new builder with the modified options
     */
    defaultIncludeFields(fields) {
        const options = this._cloneOptions();
        this._prepAttributesUpdate(options);
        if (!options.attributes.include) {
            options.attributes.include = fields;
            return QueryOptionsBuilder.create(options);
        } else {
            return this;
        }
    }

    /**
     * Updates query options to exclude the given fields
     * @param {string[]} fields
     * @returns {QueryOptionsBuilder} Return a new builder with the modified options
     */
    includeFields(fields) {
        fields = Array.isArray(fields) ? fields : [fields];
        const options = this._cloneOptions();
        this._prepAttributesUpdate(options);
        if (!options.attributes.include) {
            options.attributes.include = [];
        }
        fields.forEach((field) => {
            if (options.attributes.include.indexOf(field) == -1) {
                options.attributes.include.push(field);
            }
        });

        return QueryOptionsBuilder.create(options);
    }

    /**
     * Clones the internal options object.
     * @returns {{}}
     * @private
     */
    _cloneOptions() {
        return clone(this._options, (val) => {
            if (val instanceof Sequelize.Transaction) {
                return val;
            }
        });
    }

    /**
     * Prepares attributes for update.
     * Ensures that attributes property exists and is in object form
     * @param {object} options
     * @returns {object}
     * @private
     */
    _prepAttributesUpdate(options) {
        if (!options.attributes) {
            options.attributes = {};
        } else if (Array.isArray(options.attributes)) {
            options.attributes = {
                include: options.attributes
            };
        }

        return options;
    }

    /**
     * Prepares for where configuration update.
     * Ensure options has a where key that is ready to be modified
     * @param {object} options
     * @returns {object}
     * @private
     */
    _prepWhereUpdate(options) {
        {
            if (!options.where) {
                options.where = {};
            }
            return options;
        }
    }
}

module.exports = QueryOptionsBuilder;
