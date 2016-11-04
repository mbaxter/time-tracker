"use strict";
require('../bootstrap');
const defaultFixturesLoader = require('../db/fixtures/loaders/default-fixtures-loader');
const ValidationError = require('../db/collection/error/validation-error');

defaultFixturesLoader()
    .then(() => {
        console.log('Successfully loaded default db fixtures.');
        process.exit();
    })
    .catch((err) => {
        console.error('Encountered error loading fixtures: ' + err);
        if (err.stack) {
            console.log(err.stack);
        }
        if (err instanceof ValidationError) {
            console.log("Validation data:");
            console.log(JSON.stringify(err, null, 4));
        }
        process.exit(1);
    });