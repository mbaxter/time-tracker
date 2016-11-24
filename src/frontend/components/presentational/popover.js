"use strict";
require('../css/popover.css');
const React = require('react');

class Popover extends React.Component {
    constructor(props) {
        super(props);
        this._node = null;
        this.state = {
            width: 0,
            height: 0
        };
    }

    componentDidMount() {
        this._updateSize();
    }

    _updateSize() {
        if (!this._node) {
            return;
        }

        this._node.style.setProperty('display', 'block');
        const boundingRect = this._node.getBoundingClientRect();

        this.setState({
            width: boundingRect.width,
            height: boundingRect.height
        });
    }

    render() {
        return (
            <div ref={(node) => {this._node = node;}} className={this._getClassName()} role="tooltip" style={this._getStyle()}>
                <div className="arrow" style={{left: "50%"}}/>
                {this.props.title &&
                <h3 className="popover-title">{this.props.title}</h3>}
                <div className="popover-content">{this.props.content}</div>
            </div>
        );
    }

    _getStyle() {
        const left = Math.round(this.props.position[0] - this.state.width / 2);
        const top = Math.round(this.props.position[1] - this.state.height);

        return {
            left: `${left}px`,
            top: `${top}px`
        };
    }

    _getClassName() {
        if (this.state.width) {
            return "popover top show";
        } else {
            return "popover top";
        }
    }
}

Popover.propTypes = {
    title: React.PropTypes.string,
    content: React.PropTypes.string.isRequired,
    position: React.PropTypes.arrayOf(React.PropTypes.number)
};

Popover.defaultProps = {
    position: [0,0]
};

module.exports = Popover;
