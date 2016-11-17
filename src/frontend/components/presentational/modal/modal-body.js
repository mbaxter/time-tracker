"use strict";

const React = require('react');

const ModalBody = (props) => {
    return (
        <div className="modal-content">

            <div className="modal-header">
                <button type="button" className="close" aria-label="Close" onClick={props.onDismiss}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2 className="modal-title">{props.title}</h2>
            </div>

            <div className="modal-body">
                {props.children}
            </div>
        </div>
    );
};

ModalBody.propTypes = {
    title: React.PropTypes.node.isRequired,
    children: React.PropTypes.node,
    onDismiss: React.PropTypes.func.isRequired
};

module.exports = ModalBody;