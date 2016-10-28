"use strict";
require('../bootstrap');
const loadFixtures = require('../db/fixtures/scripts/load-default-fixtures');

loadFixtures()
    .then(() => {
        console.log('Successfully loaded default db fixtures.');
        process.exit();
    })
    .catch((err) => {
        console.error('Encountered error loading fixtures: ' + err);
        if (err.stack) {
            console.log(err.stack);
        }
        process.exit(1);
    });