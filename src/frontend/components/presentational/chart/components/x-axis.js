"use strict";
const React = require('react');
const last = require('lodash/last');
const first = require('lodash/first');

class XAxis extends React.Component {
    render() {
        let width = last(this.props.scale.range());
        let fontSize = Math.floor(1/2 * this.props.height);
        let fontBaseline = this.props.height - fontSize/3;
        let tickPadding = fontSize / 2;
        let tickSizeLarge = this.props.height - fontSize - tickPadding;
        let tickSizeSmall = tickSizeLarge / 2;

        let ticks = this._getTicksWithPosition();
        let tickMarks = this._filterTicksForPadding(ticks, this.props.tickPadding);
        let tickLabels = this._filterTicksForPadding(ticks, this.props.displayPadding);

        return (
            <g>
                <line x1={0} x2={width} y1={0} y2={0} stroke={this.props.color} strokeWidth={1}/>
                {tickMarks.map((tick, key) => {
                    return (
                        <line key={key} x1={tick.x} x2={tick.x} y1={0} y2={tickSizeSmall} stroke={this.props.color} strokeWidth={1}/>
                    );
                })}
                {tickLabels.map((tick, key) => {
                    return (
                        <g key={key}>
                            <line x1={tick.x} x2={tick.x} y1={0} y2={tickSizeLarge} stroke={this.props.color} strokeWidth={1}/>
                            <text textAnchor="middle" fontSize={fontSize} x={tick.x} y={fontBaseline}>
                                {tick.label}
                            </text>
                        </g>
                    );
                })}
            </g>
        );
    }

    _getTicksWithPosition() {
        return this.props.ticks.map((tick) => {
            return {
                label: tick.label,
                value: tick.value,
                x: this.props.scale(tick.value)
            };
        });
    }

    _filterTicksForPadding(ticks, padding) {
        let previousBoundary = first(this.props.scale.range());
        let finalBoundary = last(this.props.scale.range());
        return ticks.filter((tick) => {
            let leftBoundary = tick.x - padding / 2;
            let rightBoundary = tick.x + padding / 2;
            if (leftBoundary >= previousBoundary && rightBoundary <= finalBoundary) {
                previousBoundary = rightBoundary;
                return true;
            }
            return false;
        });
    }
}

XAxis.propTypes = {
    color: React.PropTypes.string.isRequired,
    displayPadding: React.PropTypes.number.isRequired,
    tickPadding: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.func.isRequired,
    ticks: React.PropTypes.arrayOf(React.PropTypes.shape({
        value: React.PropTypes.any.isRequired,
        label: React.PropTypes.string.isRequired
    }).isRequired).isRequired
};

XAxis.defaultProps = {
    color: "#000000",
    displayPadding: 100,
    tickPadding: 5
};

module.exports = XAxis;
