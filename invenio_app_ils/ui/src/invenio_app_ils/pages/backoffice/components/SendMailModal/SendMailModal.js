import React from 'react';
import { Header, Modal } from 'semantic-ui-react';
import { SendMailButton } from '../buttons';

const SendMailModal = () => (
  <Modal trigger={<SendMailButton />}>
    <Modal.Header>Email notification for user ....</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Header>An email will be send</Header>
        <p>
          Dear user, your loan on the specific item has expired we kindly ask
          you to return it to CERN library. Kind regards, The Library!
        </p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default SendMailModal;
