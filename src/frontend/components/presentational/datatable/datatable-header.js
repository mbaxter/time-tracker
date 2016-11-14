"use strict";
const React = require('react');

const DatatableHeader = (props) => {
    return (
        <thead>
        <tr>
            {props.columns.map((col, index) => {
                return (
                    <th key={index}>{col}</th>
                );
            })}
        </tr>
        </thead>
    );
};

DatatableHeader.propTypes = {
    columns: React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
};

module.exports = DatatableHeader;