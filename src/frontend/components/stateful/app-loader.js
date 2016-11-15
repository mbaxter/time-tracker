"use strict";
const ReactRedux = require('react-redux');
const Loader = require('../presentational/loader');
const subjectSelector = require('../../selector/subject-selector');

const mapStateToProps = (state) => {
    const loaderRequestCount = subjectSelector.loaderRequests(state);
    return {
        isEnabled: loaderRequestCount > 0
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(Loader);