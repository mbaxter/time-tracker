"use strict";
const $ = require('jquery');
const React = require('react');
const SubmitBtn = require('./form-elements/submit-button');
const InputField = require('./form-elements/input-field');
const RequiredHelpBlock = require('./form-elements/required-help-block');
const FormError = require('./form-elements/form-error');
const noop = require('lodash/noop');
const isEmpty = require('lodash/isEmpty');

class TimeBlockForm extends React.Component {
    render() {
        const props = this.props;
        return (
            <div>
                <form action="" onSubmit={this._getOnSubmitHandler()} method="POST">
                    <FormError error={props.error}/>
                    <fieldset disabled={props.disabled}>
                        <InputField name="description"
                                    value={props.fields.description}
                                    label="Description"
                                    error={props.fieldErrors.description}
                                    required={false}
                                    type="text"
                                    onChange={props.onChange}/>
                        <InputField name="start"
                                    value={props.fields.start}
                                    label="From"
                                    error={props.fieldErrors.start}
                                    required={true}
                                    type="datetime"
                                    onChange={props.onChange}/>
                        <InputField name="end"
                                    value={props.fields.end}
                                    label="To"
                                    error={props.fieldErrors.end}
                                    required={true}
                                    type="datetime"
                                    onChange={props.onChange}/>
                        <RequiredHelpBlock/>
                        <SubmitBtn>{props.submitText}</SubmitBtn>
                    </fieldset>
                </form>
            </div>
        );
    }

    _getOnSubmitHandler() {
        return (e) => {
            e.preventDefault();
            const fields = $(e.target).toJSON();
            this.props.onSubmit(fields);
        };
    }

    _getClassNameWithError(className = "") {
        return this._hasError() ? `has-error ${className}` : className;
    }

    _hasError() {
        return this.props.error || !isEmpty(this.props.fieldErrors);
    }
}

const userFields = [
    "start",
    "end",
    "description"
];
const createFieldShape = (propType) => {
    const fieldShape = {};
    userFields.forEach((field) => {
        fieldShape[field] = propType;
    });
    return React.PropTypes.shape(fieldShape);
};

TimeBlockForm.propTypes = {
    disabled: React.PropTypes.bool,
    error: React.PropTypes.string,
    fields: createFieldShape(React.PropTypes.string),
    fieldErrors: createFieldShape(React.PropTypes.string),
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func.isRequired,
    submitText: React.PropTypes.string.isRequired,
};

TimeBlockForm.defaultProps = {
    disabled: false,
    error: "",
    fields: {},
    fieldErrors: {},
    onChange: noop,
    onSubmit: noop,
    submitText: "Submit"
};

module.exports = TimeBlockForm;