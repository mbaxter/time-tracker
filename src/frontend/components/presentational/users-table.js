"use strict";
const React = require('react');
const CreateBtn = require('./button-create');
const Datatable = require('./datatable');
const DatatableActions = require('./datatable/datatable-actions');
const Paging = require('./datatable/add-ons/paging');
const UserRole = require('../../../shared/constants/user-role');

class UsersTable extends React.Component {
    render() {
        return (
            <div>
                <div className="pull-right">
                    <CreateBtn onCreate={this.props.onCreate}/>
                </div>
                <Datatable data={this.props.data} columns={this._getColumns()}/>
                <Paging {... this.props.paging} />
            </div>
        );
    }

    _getColumns() {
       return [
           {
               header: "First Name",
               displayTransform: (row) => {
                   return row.first_name;
               }
           },
           {
               header: "Last Name",
               displayTransform: (row) => {
                   return row.last_name;
               }
           },
           {
               header: "Email",
               displayTransform: (row) => {
                   return row.email;
               }
           },
           {
               header: "Role",
               displayTransform: (row) => {
                   switch (row.role) {
                       case UserRole.ADMIN:
                           return "Admin";
                       case UserRole.STANDARD:
                           return "Standard";
                       default:
                           return "";
                   }
               }
           },
           {
               header: "Actions",
               displayTransform: (row) => {
                   return (
                       <DatatableActions row={row} onEdit={this.props.onEdit} onDelete={this.props.onDelete}/>
                   );
               }
           }
       ];
    }
}

UsersTable.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    // Paging attributes
    paging: React.PropTypes.shape(Paging.propTypes),
    onCreate: React.PropTypes.func,
    onEdit: React.PropTypes.func,
    onDelete: React.PropTypes.func,
};

module.exports = UsersTable;