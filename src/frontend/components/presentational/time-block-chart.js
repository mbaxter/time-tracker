"use strict";
require('../css/fx/flex.css');
const React = require('react');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const Datatable = require('./datatable');
const BarChart = require('./chart/bar-chart');
const Popover = require('./popover');
const noop = require('lodash/noop');
const DatatableActions = require('./datatable/datatable-actions');
const Paging = require('./datatable/add-ons/paging');
const DateFilter = require('./datatable/add-ons/date-filter');
const CreateBtn = require('./button-create');
const omit = require('lodash/omit');

class TimeBlockDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popover: null,
            clientWidth: 0
        };
        this._onResize = () => {
            this._calculateWidth();
        };
    }

    render() {
        const props = this.props;
        return (
            <div ref={(node) => {this._divContainer = node;}}>
                {this.state.popover &&
                <Popover title={this.state.popover.title} content={this.state.popover.content} position={this.state.popover.position} />}
                <div className="horizontal-spread">
                    <div className="push-left">
                        <DateFilter {... props.dateFilter}/>
                    </div>
                    <div className="push-right push-down">
                        <CreateBtn onCreate={props.onCreate}/>
                    </div>
                </div>
                <br />
                <BarChart {... props.barChart} width={this.state.clientWidth} height={125}
                          xAxisHeight={20} color="#2e6da4"
                          onBarEnter={this._onBarEnterHandler()} onBarLeave={this._onBarLeaveHandler()}/>
                <Datatable data={props.data} columns={this._getColumns()}/>
                <Paging {... props.paging} />
            </div>
        );
    }

    componentDidMount() {
        window.addEventListener('resize', this._onResize);
        this._calculateWidth();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize);
    }

    _onBarEnterHandler() {
        return (position, data) => {
            this.setState({
                popover: {
                    position: position,
                    title: data.label,
                    content: `Total work: ${TimeRangeFormatter.formatMinutesForDisplay(data.y)}`
                }
            });
        };
    }

    _onBarLeaveHandler() {
        return () => {
            this.setState({
                popover: null
            });
        };
    }

    _calculateWidth() {
        if (!this._divContainer) {
            return;
        }
        let width = this._divContainer.clientWidth;
        this.setState({
            clientWidth: width
        });
    }

    _getColumns() {
        const props = this.props;
        return [
            {
                header: "Date",
                displayTransform: (row) => {
                    const dateTime = DateTimeFormatter.parseForDisplay(row.start, props.timezone);
                    return dateTime.date;
                }
            },
            {
                header: "Description",
                displayTransform: (row) => row.description
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
    }
}

TimeBlockDataTable.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onCreate: React.PropTypes.func,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    timezone: React.PropTypes.string.isRequired,
    // Paging attributes
    paging: React.PropTypes.shape(Paging.propTypes),
    // Date Filter
    dateFilter: React.PropTypes.shape(DateFilter.propTypes),
    barChart: React.PropTypes.shape(omit(BarChart.propTypes, ['width','height','color','xAxisHeight']))
};

TimeBlockDataTable.defaultProps = {
    onCreate: noop,
    onEdit: noop,
    onDelete: noop,
    data: []
};

module.exports = TimeBlockDataTable;
