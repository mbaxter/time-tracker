"use strict";
const React = require('react');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const Datatable = require('./datatable');
const noop = require('lodash/noop');
const DatatableActions = require('./datatable/datatable-actions');

const TimeBlockDataTable = (props) => {
    const columns = [
        {
            header: "Date",
            displayTransform: (row) => {
                const dateTime = DateTimeFormatter.parseForDisplay(row.start, props.timezone);
                return dateTime.date;
            }
        },
        {
            header: "From",
            displayTransform: (row) => {
                const dateTime = DateTimeFormatter.parseForDisplay(row.start, props.timezone);
                return dateTime.time;
            }
        },
        {
            header: "To",
            displayTransform: (row) => {
                const dateTime = DateTimeFormatter.parseForDisplay(row.end, props.timezone);
                return dateTime.time;
            }
        },
        {
            header: "Elapsed Time",
            displayTransform: (row) => {
                return TimeRangeFormatter.getRangeForDisplay(row.start, row.end);
            }
        },
        {
            header: "Actions",
            displayTransform: (row) => {
               return (
                   <DatatableActions row={row} onEdit={props.onEdit} onDelete={props.onDelete}/>
               );
            }
        }
    ];

    return (
        <Datatable data={props.data} columns={columns}/>
    );
};

TimeBlockDataTable.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    timezone: React.PropTypes.string.isRequired
};

TimeBlockDataTable.defaultProps = {
    onEdit: noop,
    onDelete: noop,
    data: []
};

module.exports = TimeBlockDataTable;
