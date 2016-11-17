"use strict";

const React = require('react');
const FieldGroup = require('./field-group');
const SelectField = require('./select-field');
const pick = require('lodash/pick');
const noop = require('lodash/noop');

class SelectFieldGroup extends React.Component {
    render() {
        const props = this.props;
        const fieldGroupProps = pick(props, ['error', 'required', 'label']);
        return (
            <FieldGroup {... fieldGroupProps}>
                <SelectField className="form-control" name={props.name} value={props.value} options={props.options}
                        onChange={props.onChange} required={props.required}/>
            </FieldGroup>
        );
    }
}

SelectFieldGroup.propTypes = {
    error: React.PropTypes.string,
    includeBlank: React.PropTypes.bool,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    // Object mapping from displayName => value
    options: React.PropTypes.object,
    required: React.PropTypes.bool,
    value: React.PropTypes.any
};

SelectFieldGroup.defaultProps = {
    includeBlank: true,
    onChange: noop,
    required: false,
    type: "text",
    value: ''
};

module.exports = SelectFieldGroup;