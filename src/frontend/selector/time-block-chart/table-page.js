"use strict";
const pageSelectorFactory = require('./../factory/page-data-selector-factory');
const dataset = require('./dataset');
const RecordTypes = require('../../constants/record-types');

module.exports = pageSelectorFactory(dataset, RecordTypes.TIME_BLOCK);