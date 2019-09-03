import React, { Component } from 'react';
import { Header, Modal, Button, Icon } from 'semantic-ui-react';
import SendMailButton from './SendMailButton';

export default class SendMailModal extends Component {
  state = { isModalOpen: false };

  toggle = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  render() {
    return (
      <Modal
        trigger={<SendMailButton onClick={this.toggle} />}
        open={this.state.isModalOpen}
        basic
      >
        <Modal.Header>Email notification for user ....</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>An email will be send</Header>
            <p>
              Dear user, your loan on the specific item has expired we kindly
              ask you to return it to CERN library. Kind regards, The Library!
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.toggle}>
            <Icon name="cancel" /> Cancel
          </Button>
          <Button color="green">
            <Icon name="send" /> Send
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
