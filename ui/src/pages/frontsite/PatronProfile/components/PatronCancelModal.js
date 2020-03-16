import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Modal } from 'semantic-ui-react';

export class PatronCancelModal extends Component {
  render() {
    const {
      documentTitle,
      headerContent,
      headerIcon,
      onCancelAction,
      onCloseModal,
      open,
    } = this.props;
    return (
      <Modal open={open} onClose={onCloseModal} closeIcon size="small">
        <Header icon={headerIcon} content={headerContent} />
        <Modal.Content>
          Your request for "<strong>{documentTitle}</strong>" will be cancelled.
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onCloseModal}>No, take me back</Button>
          <Button negative onClick={() => onCancelAction()}>
            Yes, I am sure
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

PatronCancelModal.propTypes = {
  documentTitle: PropTypes.string,
  headerContent: PropTypes.string.isRequired,
  headerIcon: PropTypes.string,
  onCancelAction: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

PatronCancelModal.defaultProps = {
  headerIcon: 'exclamation',
};
