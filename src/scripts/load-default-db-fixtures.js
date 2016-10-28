const loadFixtures = require('../backend/db/fixtures/scripts/load-default-fixtures');

loadFixtures()
    .then(() => {
        console.log('Successfully loaded default db fixtures.')
    })
    .catch((err) => {
        console.log('Encountered error loading fixtures: ' + err);
    });