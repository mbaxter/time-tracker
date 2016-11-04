"use strict";
const collection = require('../collection');
const Schema = require('../schema');
const map = require('lodash/map');
const compact = require('lodash/compact');
const has = require('lodash/has');
const clone = require('lodash/clone');

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
    return schema.createTransaction(() => {
        return FixtureLoader._loadFixtures(fixtures);
    });
};

/**
 * Returns a promise that resolves if all fixtures are loaded successfully
 * @param {Object} fixtures
 * @returns {Promise.<*>}
 * @private
 */
FixtureLoader._loadFixtures = function({users = [], timeBlocks = []} = {}) {
    const finalFixtures = {};
    return collection.User.upsert(users)
        .then((newUsers) => {
            // Re-query for upserted users by email_address
            // We need to requery so we can get the user ids and fulfill foreign key dependencies of other collections
            const emails = compact(map(newUsers, 'email_address'));
            return collection.User.mapByEmailAddress(emails);
        })
        .then((newUsersByEmail) => {
            // Augment original user fixtures with id
            finalFixtures.users = users.map((user) => {
                user = clone(user);
                const newUser = newUsersByEmail[user.email_address];
                user.id = newUser.id;
                return user;
            });

            return finalFixtures.users;
        })
        .then((finalUsers) => {
            // Augment time_block records with appropriate user.id
            return timeBlocks.map((row) => {
                if (!has(row, 'user_id')) {
                    return row;
                }
                const userIndex = row.user_id;
                const user = finalUsers[userIndex];
                const userId = user ? user.id : null;
                if (userId != null) {
                    // We found a valid userId mapping - return updated row
                    row.user_id = userId;
                    return row;
                }
                return row;
            });
        })
        .then((timeBlocks) => {
            // Upsert timeBlocks
            return collection.TimeBlock.upsert(timeBlocks);
        })
        .then(() => {
            // Re-query for time blocks so we can get the ids
            return collection.TimeBlock.dangerouslyRetrieveAll();
        })
        .then((newTimeBlocks) => {
            // Transform new timeBlock records into plain objects
            finalFixtures.timeBlocks = newTimeBlocks.map((newTimeBlock) => {
                return newTimeBlock.toJSON();
            });

            return finalFixtures;
        });
};

FixtureLoader.loadUsers = function() {

};

module.exports = FixtureLoader;