"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const actions = require('../../actions');
const ModalBody = require('../presentational/modal/modal-body');
const TimeBlockCreateForm = require('./time-block-create-form');
const FormNames = require('../../constants/form-names');

const TimeBlockCreateModal = (props) => {
    return (
       <ModalBody title="Create" onDismiss={props.onDismiss}>
           <TimeBlockCreateForm/>
       </ModalBody>
    );
};

TimeBlockCreateModal.propTypes = {
    onDismiss: React.PropTypes.func
};

const mapStateToProps = () => {
    return {};
};
const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: () => {
            dispatch(actions.async.navigateToPage("/app/time-blocks"));
            dispatch(actions.sync.clearForm(FormNames.TIME_BLOCK_CREATE));
        }
    };
};

module.exports = ReactRedux.connect(
   mapStateToProps,
    mapDispatchToProps
)(TimeBlockCreateModal);