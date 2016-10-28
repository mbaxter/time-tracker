"use strict";

/**
 * @param {Object} tables Maps tablename => model
 */
const createForeignKeys = function(tables) {
    tables.time_block.belongsTo(tables.user);
};

module.exports = createForeignKeys;