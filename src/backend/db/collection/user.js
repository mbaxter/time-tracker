"use strict";
const keyBy = require('lodash/keyBy');
const AbstractCollection = require('./abstract-collection');
const QueryOptionsBuilder = require('../query/query-options-builder');

class UserCollection extends AbstractCollection {
    /**
     * Return the name of this table
     * @return {string}
     */
    static get tableName() {
        return 'user';
    }

    /**
     * Query for matching users by email address
     * @param {string[]} emails
     * @param {QueryOptionsBuilder|object} options
     * @return {Promise.<Array.<User>>} Promise returns an array of user objects
     */
    retrieveByEmailAddress(emails, options = {}) {
        // Make sure emails is an array
        emails = Array.isArray(emails) ? emails : [emails];

        // Set query options
        options = QueryOptionsBuilder.toBuilder(options);
        options = options.whereIn('email_address', emails);

        return this._retrieve(options);
    }

    /**
     * Query for records with the given emails, and return an object keyed by email
     * @param {string[]} emails
     * @param {QueryOptionsBuilder|{}} options
     * @returns {Promise.<object>} Promise resolves to an object mapping email_address to User
     */
    mapByEmailAddress(emails, options = {}) {
        // Make sure we're selecting the email_address field so we can return a mapped object
        options = QueryOptionsBuilder.toBuilder(options);
        options = options.defaultIncludeFields(this.getAllFields());
        options = options.includeFields('email_address');

        return this.retrieveByEmailAddress(emails, options)
            .then((users) => {
               return keyBy(users, 'email_address');
            });
    }

    _retrieve(options) {
        options = QueryOptionsBuilder.toBuilder(options);
        options = options.excludeFields(options, ['password']);
        return this.model.findAll(options.getOptions());
    }
}

module.exports = UserCollection.create();