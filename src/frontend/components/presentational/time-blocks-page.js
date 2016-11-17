"use strict";
const React = require('react');
const TimeBlockWidget = require('../stateful/time-block-widget');
const Modal = require('./modal/modal-wrapper');

const TimeBlocksPage = (props) => {
    return (
        <div>
            <Modal show={React.Children.count(props.children) > 0}>{props.children}</Modal>
            <TimeBlockWidget />
        </div>
    );
};

TimeBlocksPage.propTypes = {
    children: React.PropTypes.node
};

module.exports = TimeBlocksPage;