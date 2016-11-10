"use strict";
const ReactRedux = require('react-redux');
const Loader = require('../presentational/loader');
const get = require('lodash/get');

const mapStateToProps = (state) => {
    const loaderRequestCount = get(state, 'ui.loader.requests', 0);
    return {
        isEnabled: loaderRequestCount > 0
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(Loader);