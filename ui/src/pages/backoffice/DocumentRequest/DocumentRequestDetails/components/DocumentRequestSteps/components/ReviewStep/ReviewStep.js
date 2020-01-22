import React, { Component } from 'react';
import { Button, Header, Icon, Message, Step } from 'semantic-ui-react';
import { documentRequest as documentRequestApi } from '@api';
import { STEPS } from '../../DocumentRequestSteps';

export const ReviewStep = ({ step }) => (
  <Step active={step === STEPS.review} disabled={step !== STEPS.review}>
    <Icon name="check" />
    <Step.Content>
      <Step.Title>Review</Step.Title>
      <Step.Description>Review before you finalize your order</Step.Description>
    </Step.Content>
  </Step>
);

export default class ReviewStepContent extends Component {
  onAcceptClick = async () => {
    const { pid } = this.props.data;
    const resp = await documentRequestApi.accept(pid, {
      state: 'ACCEPTED',
    });
    if (resp.status === 202) {
      this.props.fetchDocumentRequestDetails(pid);
    }
  };

  render() {
    const {
      step,
      data: { metadata },
    } = this.props;
    return step === STEPS.review ? (
      metadata.state !== 'ACCEPTED' ? (
        <>
          <Message info>
            <Message.Header>
              Review and accept your book request!
            </Message.Header>
            <p>Notice that you will not be able to make any further changes.</p>
          </Message>
          <Header textAlign="center">
            <Button size={'large'} primary onClick={this.onAcceptClick}>
              Accept
            </Button>
          </Header>
        </>
      ) : (
        <Message success>
          <Message.Header>
            Your order has been successfully created!
          </Message.Header>
        </Message>
      )
    ) : null;
  }
}
