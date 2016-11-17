"use strict";
require('../../css/veil.css');
const React = require('react');

const ModalWrapper = (props) => {
    const visibleClass = props.show ? 'show' : 'hide';
    return (
        <div className={visibleClass}>
            <div className="veil"/>
            <div className={`modal ${visibleClass}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

ModalWrapper.propTypes = {
    children: React.PropTypes.node,
    show: React.PropTypes.bool,
};

ModalWrapper.defaultProps = {
    show: false
};

module.exports = ModalWrapper;