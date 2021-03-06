"use strict";

const React = require('react');
const XAxis = require('./components/x-axis');
const noop = require('lodash/noop');

class BarChart extends React.Component {
    render() {
        const dataRect = this._getDataBoundingRect();
        let xScale = this.props.xScale.copy().range([0, dataRect.width]);
        let yScale = this.props.yScale.copy().range([dataRect.height, 0]);

        return (
            <svg width={this.props.width} height={this.props.height} viewBox={`0 0 ${this.props.width} ${this.props.height}`}
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="data-clip">
                        <rect x={dataRect.x} y={dataRect.y} width={dataRect.width} height={dataRect.height}/>
                    </clipPath>
                </defs>

                <g transform={`translate(${dataRect.x}, ${dataRect.y})`} clipPath="url(#data-clip)">
                    {this.props.data.map((datum, key) => {
                        let x0 = Math.floor(xScale(datum.xRange[0]));
                        let x1 = Math.ceil(xScale(datum.xRange[1]));
                        let y = yScale(datum.y);
                        let width = x1 - x0;
                        return (
                            <rect key={key} x={x0} y={y} width={width} height={dataRect.height - y}
                                  onMouseEnter={(e) => {
                                      let position = this._getBarPosition(e.target, width);
                                      this.props.onBarEnter(position, datum);
                                  }}
                                  onMouseLeave={(e) => {
                                      let position = this._getBarPosition(e.target, width);
                                      this.props.onBarLeave(position, datum);
                                  }}
                                  fill={this.props.color}/>
                        );
                    })}
                </g>

                {/* Shift x-axis down to the bottom of the chart */}
                {   this.props.xAxisHeight &&
                <g transform={`translate(${dataRect.x}, ${dataRect.height})`}>
                    <XAxis ticks={this.props.xTicks} height={this.props.xAxisHeight} scale={xScale} />
                </g>
                }

            </svg>
        );
    }

    _getBarPosition(el, barWidth) {
        let barPosition = el.getBoundingClientRect();
        let xOffset = barWidth / 2;
        return [
            barPosition.left + window.pageXOffset + xOffset,
            barPosition.top + window.pageYOffset
        ];
    }

    _getDataBoundingRect() {
        return {
            x: 0,
            y: 0,
            width: this.props.width,
            height: this.props.height - this.props.xAxisHeight
        };
    }
}

BarChart.propTypes = {
    color: React.PropTypes.string.isRequired,
    data: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            xRange: React.PropTypes.array,
            y: React.PropTypes.any
        })),
    onBarEnter: React.PropTypes.func,
    onBarLeave: React.PropTypes.func,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    // d3 scale functions
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired,
    xAxisHeight: React.PropTypes.number.isRequired,
    xTicks: XAxis.propTypes.ticks
};

BarChart.defaultProps = {
    color: "#2e6da4",
    onBarEnter: noop,
    onBarLeave: noop
};

module.exports = BarChart;