"use strict";
const pageSelectorFactory = require('./factory/page-data-selector-factory');
const timeBlockTableData = require('./time-block-table-data');
const RecordTypes = require('../constants/record-types');

module.exports = pageSelectorFactory(timeBlockTableData, RecordTypes.TIME_BLOCK);