"use strict";

const React = require('react');
const noop = require('lodash/noop');
const map = require('lodash/map');

class SelectField extends React.Component {
    render() {
        const props = this.props;
        return (
                <select className="form-control" name={props.name} value={props.value}
                        onChange={this._getOnChangeHandler()} required={props.required}>
                    {this._renderOptions()}
                </select>
        );
    }

    _renderOptions() {
        const options = map(this.props.options, (optionValue, optionLabel) => {
            return (
                <option value={optionValue} key={optionLabel}>{optionLabel}</option>
            );
        });

        if(this.props.includeBlank) {
            options.unshift(<option key="blank"/>);
        }

        return options;
    }

    _getOnChangeHandler() {
        return (e) => {
            const fieldName = e.target.name;
            const value = e.target.value;
            this.props.onChange(fieldName, value);
        };
    }
}

SelectField.propTypes = {
    includeBlank: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    // Object mapping from displayName => value
    options: React.PropTypes.object,
    required: React.PropTypes.bool,
    value: React.PropTypes.any
};

SelectField.defaultProps = {
    includeBlank: true,
    onChange: noop,
    required: false,
    type: "text",
    value: ''
};

module.exports = SelectField;