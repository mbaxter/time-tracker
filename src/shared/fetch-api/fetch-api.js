"use strict";
const fetch = require('isomorphic-fetch');
const last = require('lodash/last');
const urlJoin = require('../util/url/url-join');

class FetchApi {
    constructor(baseUrl = "/") {
        this._baseUrl = urlJoin(baseUrl, "api", this._getBasePath());
        // Remove any trailing slash
        if (last(this._baseUrl) == "/") {
            this._baseUrl = this._baseUrl.slice(0,-1);
        }
    }

    /**
     * Subclasses can override this to set a base path like "/users" for example
     * @returns {string}
     * @protected
     */
    _getBasePath() {
        return "";
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

    makeRequest(path, method="GET", data) {
        const options = {};
        options.headers = this.constructor.getHeaders();
        options.method = method;
        if (data) {
            options.body = JSON.stringify(data);
        }

        const url = urlJoin(this._baseUrl, path);
        return fetch(url, options);
    }

    static getHeaders() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
}

module.exports = FetchApi;