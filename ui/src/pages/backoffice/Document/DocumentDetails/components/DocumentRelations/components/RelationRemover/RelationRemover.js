import { recordToPidType } from '@api/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';

export default class RelationRemover extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  handleClose = () => this.setState({ modalOpen: false });
  handleOpen = () => this.setState({ modalOpen: true });

  handleDelete = () => {
    const { related, referer, relationPayloadType } = this.props;

    this.setState({ modalOpen: false });
    let deletePayload = {};
    if (relationPayloadType === 'siblings') {
      deletePayload = {
        pid: related.pid,
        pid_type: related.pid_type,
        relation_type: related.relation_type,
      };
    } else {
      deletePayload = {
        parent_pid: related.pid,
        parent_pid_type: related.pid_type,
        child_pid: referer.metadata.pid,
        child_pid_type: recordToPidType(referer),
        relation_type: related.relation_type,
      };
    }
    this.props.deleteRelations(referer.metadata.pid, [deletePayload]);
  };

  render() {
    const { trigger, buttonContent, header } = this.props;

    return (
      <Modal
        trigger={
          trigger || (
            <Button icon labelPosition="left">
              <Icon name="trash" />
              {buttonContent}
            </Button>
          )
        }
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
  /* pid of the record calling this remover */
  /* TODO PID AS OBJECT */
  referer: PropTypes.object.isRequired,
  /* destination to be removed */
  related: PropTypes.object.isRequired,

  relationPayloadType: PropTypes.string.isRequired,

  /* supplied by reducer */
  deleteRelations: PropTypes.func.isRequired,
  buttonContent: PropTypes.string.isRequired,

  modalTrigger: PropTypes.node,
  modalHeader: PropTypes.string,
  modalContent: PropTypes.string,
};

RelationRemover.defaultProps = {
  relationPayloadType: 'parent',
};
