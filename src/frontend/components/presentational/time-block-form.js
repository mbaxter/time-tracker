"use strict";
const $ = require('jquery');
const React = require('react');
const SubmitBtn = require('./form-elements/button-submit');
const InputFieldGroup = require('./form-elements/input-field-group');
const FieldGroup = require('./form-elements/field-group');
const InputField = require('./form-elements/input-field');
const RequiredHelpBlock = require('./form-elements/required-help-block');
const FormError = require('./form-elements/form-error');
const noop = require('lodash/noop');
const isEmpty = require('lodash/isEmpty');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const moment = require('moment');
const isUndefined = require('lodash/isUndefined');

class TimeBlockForm extends React.Component {
    render() {
        const props = this.props;
        const startDateTime = this._getDateTimeComponents(this.props.fields.start);
        const endDateTime = this._getDateTimeComponents(this.props.fields.end);

        const startDate = isUndefined(this.props.fields.startDate) ? startDateTime.date : this.props.fields.startDate;
        const startTime = isUndefined(this.props.fields.startTime) ? startDateTime.time : this.props.fields.startTime;

        const endDate = isUndefined(this.props.fields.endDate) ? endDateTime.date : this.props.fields.endDate;
        const endTime = isUndefined(this.props.fields.endTime) ? endDateTime.time : this.props.fields.endTime;

        return (
            <div>
                <form action="" onSubmit={this._getOnSubmitHandler()} method="POST">
                    <FormError error={props.error}/>
                    <fieldset disabled={props.disabled}>
                        <InputFieldGroup name="description"
                                         value={props.fields.description}
                                         label="Description"
                                         error={props.fieldErrors.description}
                                         required={false}
                                         type="text"
                                         onChange={props.onChange}/>
                        <FieldGroup label="Start" error={props.fieldErrors.start} required={true}>
                            <InputField
                                   name="startDate"
                                   value={startDate}
                                   required={true}
                                   type="date"
                                   placeholder="YYYY-MM-DD"
                                   onChange={props.onChange}/>
                            <InputField
                                   name="startTime"
                                   value={startTime}
                                   required={true}
                                   type="text"
                                   placeholder="HH:mm"
                                   onChange={props.onChange}/>
                        </FieldGroup>
                        <FieldGroup label="End" error={props.fieldErrors.end} required={true}>
                            <InputField
                                   name="endDate"
                                   value={endDate}
                                   required={true}
                                   type="date"
                                   placeholder="YYYY-MM-DD"
                                   onChange={props.onChange}/>
                            <InputField
                                   name="endTime"
                                   value={endTime}
                                   required={true}
                                   type="text"
                                   placeholder="HH:mm"
                                   onChange={props.onChange}/>
                        </FieldGroup>
                        <RequiredHelpBlock/>
                        <SubmitBtn>{props.submitText}</SubmitBtn>
                    </fieldset>
                </form>
            </div>
        );
    }

    _getDateTimeComponents(datetime) {
        const components = DateTimeFormatter.parseForDisplay(datetime, this.props.timezone);
        components.date = moment(components.date, DateTimeFormatter.Date.displayFormat).format('YYYY-MM-DD');

        return components;
    }

    _mergeDateTimeComponents(date, time) {
        return DateTimeFormatter.normalize(date, time, this.props.timezone);
    }

    _getOnSubmitHandler() {
        return (e) => {
            e.preventDefault();
            const fields = $(e.target).toJSON();
            const start = this._mergeDateTimeComponents(fields.startDate, fields.startTime);
            const end = this._mergeDateTimeComponents(fields.endDate, fields.endTime);

            this.props.onSubmit({
                start,
                end,
                description: fields.description
            });
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
    timezone: React.PropTypes.string.isRequired,
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