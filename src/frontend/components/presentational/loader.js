"use strict";
require('../css/loader.css');
require('../css/fx/shadow.css');
const React = require('react');

const Loader = (props) => {
    return (
        <div className={props.isEnabled ? "show" : "hide"}>
            <div className="spinner">
                <div className="spinner-bars">
                    <div className="spinner-bar spinner-bar1 shadow"></div>
                    <div className="spinner-bar spinner-bar2 shadow"></div>
                    <div className="spinner-bar spinner-bar3 shadow"></div>
                </div>
            </div>
            <div className="spinner">
                <div className="spinner-bars">
                    <div className="spinner-bar spinner-bar1"></div>
                    <div className="spinner-bar spinner-bar2"></div>
                    <div className="spinner-bar spinner-bar3"></div>
                </div>
            </div>
        </div>
    );
};

Loader.propTypes = {
    isEnabled: React.PropTypes.bool
};

Loader.defaultProps = {
    isEnabled: false
};

module.exports = Loader;