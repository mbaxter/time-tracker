"use strict";
const keyBy = require('lodash/keyBy');
const AbstractCollection = require('./abstract-collection');
const QueryOptionsBuilder = require('../query/query-options-builder');
const clone = require('lodash/clone');
const bcrypt = require('../../security/bcrypt');
const Promise = require('bluebird');
const userValidator = require('../../../shared/validation/model/user-validator');
const first = require('lodash/first');

class UserCollection extends AbstractCollection {
    /**
     * Return the name of this table
     * @return {string}
     */
    static get tableName() {
        return 'user';
    }

    static get validator() {
        return userValidator;
    }

    upsert(records, options = {}) {
        // Hash the password values before upserted records
        return Promise.map(records, (record) => {
            return bcrypt.hash(record.password)
                .then((hash) => {
                    record = clone(record);
                    record.password = hash;
                    return record;
                });
        }).then((records) => {
            return super.upsert(records, options);
        });
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise.<User>}
     */
    retrieveOneByEmailAddressAndPassword(email, password) {
        const options = QueryOptionsBuilder.create()
            .where('email_address', email);

        return this._findAll(options)
            .then((users) => {
                return first(users);
            })
            .then((user) => {
                if(!user) {
                    return user;
                }

                return bcrypt.verify(password, user.password)
                    .then((passwordIsValid) => {
                        if(passwordIsValid) {
                            return user;
                        }
                        return undefined;
                    });
            });
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

        return this._findAll(options);
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
}

module.exports = UserCollection.create();