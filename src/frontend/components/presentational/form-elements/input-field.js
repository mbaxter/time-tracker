"use strict";

const React = require('react');
const noop = require('lodash/noop');

class InputField extends React.Component {
    render() {
        const props = this.props;
        return (
                <input type={props.type} className="form-control" name={props.name} required={props.required}
                       placeholder={props.placeholder} value={props.value} onChange={this._getOnChangeHandler()}/>
        );
    }

    _getOnChangeHandler() {
        return (e) => {
            const fieldName = e.target.name;
            const value = e.target.value;
            this.props.onChange(fieldName, value);
        };
    }
}

InputField.propTypes = {
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any
};

InputField.defaultProps = {
    onChange: noop,
    required: false,
    type: "text",
    value: ''
};

module.exports = InputField;