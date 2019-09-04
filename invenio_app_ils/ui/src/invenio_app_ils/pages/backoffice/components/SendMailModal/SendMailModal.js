import React, { Component } from 'react';
import { Header, Modal, Button, Icon } from 'semantic-ui-react';
import SendMailButton from './SendMailButton';
import { loan as loanApi } from '../../../../common/api';

export default class SendMailModal extends Component {
  state = { isModalOpen: false };

  toggle = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  sendEmail = async () => {
    const { loan } = this.props;
    const payload = {
      template: 'overdue',
      loanPid: loan.metadata.pid,
    };
    const response = await loanApi.postEmail(payload);
    console.log('The reponse for sendEmail', response);
  };

  render() {
    const { loan } = this.props;
    return (
      <Modal
        trigger={<SendMailButton onClick={this.toggle} />}
        open={this.state.isModalOpen}
      >
        <Modal.Header>Email notification</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>
              Item with barcode {loan.metadata.item.barcode} is overdue!
            </Header>
            <p>
              An email reminder will be send to patron with id{' '}
              <strong>{loan.metadata.patron_pid}</strong> about the overdue
              item.
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.toggle}>
            <Icon name="cancel" /> Cancel
          </Button>
          <Button color="green" onClick={this.sendEmail}>
            <Icon name="send" /> Send
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
