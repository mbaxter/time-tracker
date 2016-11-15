"use strict";
const React = require('react');

const DatatableActions = (props) => {
    return (
        <div className="btn-group" role="group">
            <button key="edit" className="btn btn-default btn-xs" onClick={() => props.onEdit(props.row)}>Edit</button>
            <button key="del" className="btn btn-default btn-xs" onClick={() => props.onDelete(props.row)}>Delete</button>
        </div>
    );
};

DatatableActions.propTypes = {
    row: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired
};

module.exports = DatatableActions;