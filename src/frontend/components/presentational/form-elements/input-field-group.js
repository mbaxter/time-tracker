"use strict";

const React = require('react');
const FieldGroup = require('./field-group');
const InputField = require('./input-field');
const noop = require('lodash/noop');
const pick = require('lodash/pick');

class InputFieldGroup extends React.Component {
    render() {
        const props = this.props;
        const fieldGroupProps = pick(props, ['error', 'required', 'label']);
        return (
            <FieldGroup {... fieldGroupProps}>
                <InputField type={props.type} name={props.name} required={props.required}
                       placeholder={props.placeholder} value={props.value} onChange={props.onChange}/>
            </FieldGroup>
        );
    }
}

InputFieldGroup.propTypes = {
    error: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any
};

InputFieldGroup.defaultProps = {
    onChange: noop,
    required: false,
    type: "text",
    value: ''
};

module.exports = InputFieldGroup;