"use strict";
const fetchApi = require('../../shared/fetch-api');

const apiUrl = process.env.API_URL;

const Api = {};
Api.Auth = fetchApi.Auth.create(apiUrl);
Api.Users = fetchApi.Users.create(apiUrl);
Api.TimeBlocks = fetchApi.TimeBlocks.create(apiUrl);

Api.setAuthToken = (token) => {
    Api.Auth.authToken = token;
    Api.Users.authToken = token;
    Api.TimeBlocks.authToken = token;
};

module.exports = Api;

