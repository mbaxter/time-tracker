"use strict";

const Redux = require('redux');
const reducer = require('../../../frontend/reducer');
const actions = require('../../../frontend/actions/sync');
const FormNames = require('../../../frontend/constants/form-names');
const userFixtures = require('../../db/fixtures/data/user-fixtures');

const user = userFixtures[1];

let store = Redux.createStore(
    reducer
);

store.dispatch(actions.updateFormField(FormNames.LOGIN, 'email_address', user.email_address));
store.dispatch(actions.updateFormField(FormNames.LOGIN, 'password', user.password));

module.exports = JSON.stringify(store.getState());