"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const actions = require('../../actions');
const ModalBody = require('../presentational/modal/modal-body');
const TimeBlockEditForm = require('./time-block-edit-form');
const FormNames = require('../../constants/form-names');

const TimeBlockEditModal = (props) => {
    return (
       <ModalBody title="Edit" onDismiss={props.onDismiss}>
           <TimeBlockEditForm id={props.id}/>
       </ModalBody>
    );
};

TimeBlockEditModal.propTypes = {
    id: React.PropTypes.string,
    onDismiss: React.PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
    return {
        id: ownProps.params.timeBlockId
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: () => {
            dispatch(actions.async.navigateToPage("/app/time-blocks"));
            dispatch(actions.sync.clearForm(FormNames.TIME_BLOCK_EDIT));
        }
    };
};

module.exports = ReactRedux.connect(
   mapStateToProps,
    mapDispatchToProps
)(TimeBlockEditModal);