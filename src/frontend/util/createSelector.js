"use strict";
const isEqual = require('lodash/isEqual');
const reselect = require('reselect');

module.exports = reselect.createSelectorCreator(reselect.defaultMemoize, isEqual);