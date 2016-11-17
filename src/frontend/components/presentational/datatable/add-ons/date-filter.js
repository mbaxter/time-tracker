"use strict";
require('../../../css/date-filter.css');
const React = require('react');
const SubmitBtn = require('../../form-elements/submit-button');
const ResetBtn = require('../../form-elements/reset-button');
const InputField = require('../../form-elements/input-field-group');
const $ = require('jquery');

const DateFilter = (props) => {
    return (
        <form className="form-inline date-filter" action="" method="POST"
              onSubmit={(e) => {
                  e.preventDefault();
                  const fields = $(e.target).toJSON();
                  props.onSubmit(fields);
              }}
              onReset={(e) => {
                  e.preventDefault();
                  props.onReset();
              }}>
            <InputField name="from" value={props.from} label="From: " placeholder="YYYY-MM-DD" type="date" onChange={props.onChange}/>
            <InputField name="to" value={props.to} label="To: " placeholder="YYYY-MM-DD" type="date" onChange={props.onChange}/>
            <div className="btn-group" role="group">
                <SubmitBtn/>
                <ResetBtn/>
            </div>
            <span className="text-danger">{props.error}</span>
        </form>
    );
};

DateFilter.propTypes = {
    error: React.PropTypes.string,
    from: React.PropTypes.string,
    to: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onReset: React.PropTypes.func.isRequired
};

DateFilter.defaultProps = {
    error: "",
    from: "",
    to: ""
};

module.exports = DateFilter;