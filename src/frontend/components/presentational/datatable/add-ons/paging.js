"use strict";
require('../../../css/fx/flex.css');
require('../../../css/paging.css');
const React = require('react');
const noop = require('lodash/noop');

const Paging = (props) => {
    const previousPage = Math.max(0, props.currentPage - 1);
    const nextPage = Math.min(props.currentPage + 1, props.totalPages || props.currentPage + 1);
    return (
        <div className="horizontal-spread">
            {(props.totalPages > 1) &&
            <div className="horizontal-spread">
                <div className="btn-group" role="group">
                    <button key="firstPage" className="btn btn-default btn-sm" disabled={props.currentPage == 1}
                            onClick={() => props.onGoToPage(1)} aria-label="First Page">
                        <i className="fa fa-fast-backward"/> First
                    </button>
                    <button key="previousPage" className="btn btn-default btn-sm" disabled={props.currentPage == 1}
                            onClick={() => props.onGoToPage(previousPage)} aria-label="Previous Page">
                        <i className="fa fa-step-backward"/> Previous
                    </button>
                </div>
                <p className="current-page">Page {props.currentPage} / {props.totalPages || <i>Calculating ...</i>}</p>
                <div className="btn-group" role="group">
                    <button key="nextPage" className="btn btn-default btn-sm"
                            disabled={props.currentPage == props.totalPages}
                            onClick={() => props.onGoToPage(nextPage)} aria-label="Next Page">
                        Next <i className="fa fa-step-forward"/>
                    </button>
                    <button key="lastPage" className="btn btn-default btn-sm"
                            disabled={props.currentPage == props.totalPages}
                            onClick={() => props.onGoToPage(-1)} aria-label="Last Page">
                        Last <i className="fa fa-fast-forward"/>
                    </button>
                </div>
            </div>
            }
        </div>
    );
};

Paging.propTypes = {
    onGoToPage: React.PropTypes.func.isRequired,
    currentPage: React.PropTypes.number,
    totalPages: React.PropTypes.number,
};

Paging.defaultProps = {
    onGoToPage: noop,
    currentPage: 1
};

module.exports = Paging;