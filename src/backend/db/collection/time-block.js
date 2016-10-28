"use strict";

const AbstractCollection = require('./abstract-collection');

class TimeBlockCollection extends AbstractCollection {
    /**
     * Return the name of this table
     * @return {string}
     */
    static get tableName() {
        return 'time_block';
    }
}

module.exports = TimeBlockCollection;