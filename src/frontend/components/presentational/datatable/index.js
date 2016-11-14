"use strict";
const React = require('react');
const Row = require('./datatable-row');
const Header = require('./datatable-header');
const pick = require('lodash/pick');

class Datatable extends React.Component {
   render() {
      return (
          <table className="table">
              <Header columns={this.props.columns.map((col) => col.header)}/>
              <tbody>
              {
                 this.props.data.map((row) => {
                    return (
                        <Row data={this.props.columns.map((col) => col.displayTransform(row))}/>
                    );
                 })
              }
              </tbody>
          </table>
      );
   }
}

Datatable.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.shape({
        header: React.PropTypes.node,
        // Transforms a plain object row of data to a display value for the column
        displayTransform: React.PropTypes.func
    })).isRequired
};

module.exports = Datatable;