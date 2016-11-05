"use strict";
const fetch = require('isomorphic-fetch');
const urlJoin = require('../util/url/url-join');

class FetchApi {
    constructor(baseUrl = "/", authToken = null) {
        this._baseUrl = baseUrl;
        this._authToken = authToken;
    }

    set authToken(token) {
        this._authToken = token;
    }

    clearAuthToken() {
        this._authToken = null;
    }

    static create(baseUrl) {
        return new this(baseUrl);
    }

    get(path) {
        return this.makeRequest(path, "GET");
    }

    post(path, data) {
        return this.makeRequest(path, "POST", data);
    }

    patch(path, data) {
        return this.makeRequest(path, "PATCH", data);
    }

    put(path, data) {
        return this.makeRequest(path, "PUT", data);
    }

    del(path, data) {
        return this.makeRequest(path, "DELETE", data);
    }

    makeRequest(path, method="GET", data) {
        const options = {};
        options.headers = this.getHeaders();
        options.method = method;
        if (data) {
            options.body = JSON.stringify(data);
        }

        const url = urlJoin(this._baseUrl, path);
        return fetch(url, options);
    }

    getHeaders() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        if (this._authToken) {
            headers['Authorization'] = `Bearer ${this._authToken}`;
        }
        return headers;
    }
}

module.exports = FetchApi;