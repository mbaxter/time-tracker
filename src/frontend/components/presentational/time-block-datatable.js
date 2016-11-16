"use strict";
const React = require('react');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const Datatable = require('./datatable');
const noop = require('lodash/noop');
const DatatableActions = require('./datatable/datatable-actions');
const Paging = require('./datatable/add-ons/paging');
const DateFilter = require('./datatable/add-ons/date-filter');

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
        <div>
            <DateFilter {... props.dateFilter}/>
            <Datatable data={props.data} columns={columns}/>
            <Paging {... props.paging} />
        </div>
    );
};

TimeBlockDataTable.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    timezone: React.PropTypes.string.isRequired,
    // Paging attributes
    paging: React.PropTypes.shape(Paging.propTypes),
    // Date Filter
    dateFilter: React.PropTypes.shape(DateFilter.propTypes)
};

TimeBlockDataTable.defaultProps = {
    onEdit: noop,
    onDelete: noop,
    data: []
};

module.exports = TimeBlockDataTable;
