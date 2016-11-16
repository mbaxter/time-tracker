"use strict";
const reselect = require('reselect');
const subjectSelectors = require('../subject-selector/index');

module.exports = (getDataSelector, tableName) => {
    return reselect.createSelector(
        getDataSelector,
        subjectSelectors.paging(tableName),
        (data, {pageSize, offset}) => {
            if (offset > data.length) {
                let adjustment = Math.ceil((offset - data.length) / pageSize) * pageSize;
                offset -= adjustment;
            }
            const currentPage = Math.floor(offset / pageSize) + 1;
            const totalPages = Math.ceil(data.length / pageSize);
            data = data.slice(offset, offset + pageSize);
            return {
                currentPage,
                totalPages,
                data
            };
        }
    );
};