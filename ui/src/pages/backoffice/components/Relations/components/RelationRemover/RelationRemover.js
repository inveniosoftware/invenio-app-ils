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
    const { related, referrer } = this.props;

    this.setState({ modalOpen: false });
    this.props.deleteRelations(referrer, related);
  };

  render() {
    const { trigger, buttonContent } = this.props;

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
        closeIcon
      >
        <Modal.Header>Confirm removal</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete this relation?
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.handleClose()}>No, take me back</Button>
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
  referrer: PropTypes.object.isRequired,
  /* destination to be removed */
  related: PropTypes.object.isRequired,

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
