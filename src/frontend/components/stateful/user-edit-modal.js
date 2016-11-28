"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const actions = require('../../actions');
const ModalBody = require('../presentational/modal/modal-body');
const UserEditForm = require('./user-edit-form');
const FormNames = require('../../constants/form-names');

const UserEditModal = (props) => {
    return (
       <ModalBody title="Edit" onDismiss={props.onDismiss}>
           <UserEditForm id={props.id} isForUpdate={true}/>
       </ModalBody>
    );
};

UserEditModal.propTypes = {
    id: React.PropTypes.string,
    onDismiss: React.PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
    return {
        id: ownProps.params.userId
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: () => {
            dispatch(actions.async.navigateToPage("/app/users"));
            dispatch(actions.sync.clearForm(FormNames.USER_EDIT));
        }
    };
};

module.exports = ReactRedux.connect(
   mapStateToProps,
    mapDispatchToProps
)(UserEditModal);