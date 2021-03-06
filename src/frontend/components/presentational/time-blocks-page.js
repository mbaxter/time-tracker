"use strict";
const React = require('react');
const TimeBlockChart = require('../stateful/app-time-block-chart');
const Modal = require('./modal/modal-wrapper');

const TimeBlocksPage = (props) => {
    return (
        <div>
            <Modal show={React.Children.count(props.children) > 0}>{props.children}</Modal>
            <h2>Manage Time</h2>
            <TimeBlockChart />
        </div>
    );
};

TimeBlocksPage.propTypes = {
    children: React.PropTypes.node
};

module.exports = TimeBlocksPage;