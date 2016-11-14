"use strict";
const React = require('react');

const DatatableRow = (props) => {
    return (
        <tr>
            {props.data.map((datum) => {
                return (
                    <td>{datum}</td>
                );
            })}
        </tr>
    );
};

DatatableRow.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
};

module.exports = DatatableRow;