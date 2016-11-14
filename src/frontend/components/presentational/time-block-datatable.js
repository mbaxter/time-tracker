"use strict";
const React = require('react');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const Datatable = require('./datatable');
const noop = require('lodash/noop');

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
                   <div className="btn-group" role="group">
                       <button key="edit" className="btn btn-default btn-xs" onClick={() => props.onEdit(row)}>Edit</button>
                       <button key="del" className="btn btn-default btn-xs" onClick={() => props.onDelete(row)}>Delete</button>
                   </div>
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
    onEdit: React.PropTypes.func.isRequired
};

TimeBlockDataTable.defaultProps = {
    onEdit: noop,
    onDelete: noop,
    data: []
};

module.exports = TimeBlockDataTable;
