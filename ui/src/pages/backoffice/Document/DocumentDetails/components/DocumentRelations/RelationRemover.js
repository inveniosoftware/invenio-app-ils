import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';

export default class RelationRemover extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  handleClose = () => this.setState({ modalOpen: false });
  handleOpen = () => this.setState({ modalOpen: true });

  handleDelete = () => {
    const { deletePayload, refererPid } = this.props;
    this.setState({ modalOpen: false });
    this.props.deleteRelations(refererPid, [deletePayload]);
  };

  render() {
    const { trigger, buttonContent, header } = this.props;

    return (
      <Modal
        trigger={trigger || <Button>{buttonContent}</Button>}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        open={this.state.modalOpen}
      >
        <Modal.Header>{header && 'Confirm removal'}</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete this relation?
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={() => this.handleClose()}>
            No, take me back
          </Button>
          <Button negative onClick={() => this.handleDelete()}>
            Yes, I am sure
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

RelationRemover.propTypes = {
  /* Description of the relation to be deleted */
  deletePayload: PropTypes.object.isRequired,
  /* pid of the record using this remover */
  /* TODO PID AS OBJECT */
  refererPid: PropTypes.string.isRequired,
  /* supplied by reducer */
  deleteRelations: PropTypes.func.isRequired,
  buttonContent: PropTypes.string.isRequired,

  modalTrigger: PropTypes.node,
  modalHeader: PropTypes.string,
  modalContent: PropTypes.string,
};
