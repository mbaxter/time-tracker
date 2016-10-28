"use strict";
const collection = require('../collection');
const Promise = require('bluebird');
const Schema = require('../schema');
const map = require('lodash/map');
const compact = require('lodash/compact');
const has = require('lodash/has');
const get = require('lodash/get');

const schema = Schema.getInstance();

const FixtureLoader = {};
/**
 * Take an object that maps table name => array of rows, and upsert the data to the database.
 * Fixtures are loaded within a transaction.  If loading fails, transaction is rolled back.
 * @param {object} fixtures Fixtures maps tableName => array of objects.  Each object represents a row to insert.
 *  Foreign key fields work by referencing the index of the appropriate related record.  For example, a fixtures
 *  object may have a key 'user' with an array of users, and a 'time_block' key with an array of time_blocks.  Each
 *  time_block.user_id value will be an integer referencing the index of the user it should belong to.
 *  @return {Promise.<*>} Returns a promise that resolves if all fixtures are loaded successfully.
 */
FixtureLoader.load = function(fixtures) {
    schema.createTransaction(() => {
        return FixtureLoader._loadFixtures(fixtures);
    });
};

/**
 * Returns a promise that resolves if all fixtures are loaded successfully
 * @param fixtures
 * @returns {Promise.<*>}
 * @private
 */
FixtureLoader._loadFixtures = function(fixtures) {
    return (new Promise(() => {
        // Upsert users if they're present
        if(fixtures.user) {
            return collection.User.upsert(fixtures.user);
        }

        return [];
    }))
        .then((users) => {
            // Re-query for upserted users by email
            // We need to requery so we can get the user ids and fulfill foreign key dependencies of other collections
            const emails = compact(map(users, 'email'));
            return collection.User.mapByEmailAddress(emails);
        })
        .then((emailToUserMap) => {
            // Augment time_block records with appropriate user.id
            if (fixtures.time_block) {
                    return fixtures.time_block.map((row) => {
                        if (!has(row, 'user_id')) {
                            return row;
                        }
                        const userEmail = get(fixtures, `user[${row.user_id}].email_address`,'');
                        const userId = get(emailToUserMap, `${userEmail}.id`, null);
                        if (userId != null) {
                            // We found a valid userId mapping - return updated row
                            row.user_id = userId;
                            return row;
                        }
                        return row;
                    });
            } else {
                return [];
            }
        })
        .then((timeBlocks) => {
            // Upsert timeBlocks
            return collection.TimeBlock.upsert(timeBlocks);
        });
};

FixtureLoader.loadUsers = function() {

};

module.exports = FixtureLoader;