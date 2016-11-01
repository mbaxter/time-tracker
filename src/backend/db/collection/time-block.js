"use strict";

const AbstractCollection = require('./abstract-collection');
const validator = require('../../../shared/validation/model/time-block-validator');

class TimeBlockCollection extends AbstractCollection {
    /**
     * Return the name of this table
     * @return {string}
     */
    static get tableName() {
        return 'time_block';
    }

    static get validator() {
        return validator;
    }
}

module.exports = TimeBlockCollection.create();