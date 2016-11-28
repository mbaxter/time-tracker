"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const actions = require('../../actions');
const ModalBody = require('../presentational/modal/modal-body');
const UserCreateForm = require('./user-create-form');
const FormNames = require('../../constants/form-names');

const UserCreateModal = (props) => {
    return (
       <ModalBody title="Create" onDismiss={props.onDismiss}>
           <UserCreateForm/>
       </ModalBody>
    );
};

UserCreateModal.propTypes = {
    onDismiss: React.PropTypes.func
};

const mapStateToProps = () => {
    return {};
};
const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: () => {
            dispatch(actions.async.navigateToPage("/app/users"));
            dispatch(actions.sync.clearForm(FormNames.USER_CREATE));
        }
    };
};

module.exports = ReactRedux.connect(
   mapStateToProps,
    mapDispatchToProps
)(UserCreateModal);