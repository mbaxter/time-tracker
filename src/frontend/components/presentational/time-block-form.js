"use strict";
const $ = require('jquery');
const React = require('react');
const SubmitBtn = require('./form-elements/submit-button');
const InputField = require('./form-elements/input-field');
const FieldGroup = require('./form-elements/field-group');
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
                        <InputField name="description"
                                    value={props.fields.description}
                                    label="Description"
                                    error={props.fieldErrors.description}
                                    required={false}
                                    type="text"
                                    onChange={this._getOnChangeHandler('description')}/>
                        <FieldGroup label="Start" error={props.fieldErrors.start} required={true}>
                            <input className="form-control"
                                   name="startDate"
                                   value={startDate}
                                   required={true}
                                   type="date"
                                   placeholder="YYYY-MM-DD"
                                   onChange={this._getOnChangeHandler('start-date')}/>
                            <input className="form-control"
                                   name="startTime"
                                   value={startTime}
                                   required={true}
                                   type="time"
                                   placeholder="HH:mm"
                                   onChange={this._getOnChangeHandler('start-time')}/>
                        </FieldGroup>
                        <FieldGroup label="End" error={props.fieldErrors.end} required={true}>
                            <input className="form-control"
                                   name="endDate"
                                   value={endDate}
                                   required={true}
                                   type="date"
                                   placeholder="YYYY-MM-DD"
                                   onChange={this._getOnChangeHandler('end-date')}/>
                            <input className="form-control"
                                   name="endTime"
                                   value={endTime}
                                   required={true}
                                   type="time"
                                   placeholder="HH:mm"
                                   onChange={this._getOnChangeHandler('end-time')}/>
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
        components.time = moment(components.time, DateTimeFormatter.Time.displayFormat).format('HH:mm');

        return components;
    }

    _mergeDateTimeComponents(date, time) {
        return DateTimeFormatter.normalize(date, time, this.props.timezone);
    }

    _getOnChangeHandler(field) {
        if (field == 'description') {
            return this.props.onChange;
        } else {
            return (e) => {
                const fieldValue = e.target.value;
                const fieldName = e.target.name;
                this.props.onChange(fieldName, fieldValue);
            };
        }
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