"use strict";
const createSelector = require('../../util/createSelector');
const subjectSelectors = require('../subject-selector/index');

module.exports = (getDataSelector, tableName) => {
    return createSelector(
        getDataSelector,
        subjectSelectors.paging(tableName),
        (data, {pageSize, offset}) => {
            const lastIndex = data.length - 1;
            if (offset > lastIndex) {
                let adjustment = Math.ceil((offset - lastIndex) / pageSize) * pageSize;
                offset -= adjustment;
            }
            const currentPage = Math.floor(offset / pageSize) + 1;
            const totalPages = Math.ceil(data.length / pageSize) || 1;
            data = data.slice(offset, offset + pageSize);
            return {
                currentPage,
                totalPages,
                data
            };
        }
    );
};