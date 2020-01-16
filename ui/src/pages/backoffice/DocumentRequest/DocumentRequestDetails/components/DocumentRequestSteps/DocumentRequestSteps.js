import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Icon, Message, Step } from 'semantic-ui-react';
import { DocumentIcon } from '@pages/backoffice/components';
import { DocumentStepContent, ProviderStepContent } from './components';

export const STEPS = {
  document: 'document',
  provider: 'provider',
  review: 'review',
};

const DocumentStep = ({ step }) => (
  <Step active={step === STEPS.document}>
    <DocumentIcon />
    <Step.Content>
      <Step.Title>Select Document</Step.Title>
      <Step.Description>Attach a document to your request</Step.Description>
    </Step.Content>
  </Step>
);

const ProviderStep = ({ step }) => (
  <Step active={step === STEPS.provider} disabled={step === STEPS.document}>
    <Icon name="truck" />
    <Step.Content>
      <Step.Title>Select Provider</Step.Title>
      <Step.Description>
        Acquire or borrow from another Library
      </Step.Description>
    </Step.Content>
  </Step>
);

const ReviewStep = ({ step }) => (
  <Step active={step === STEPS.review} disabled={step !== STEPS.review}>
    <Icon name="check" />
    <Step.Content>
      <Step.Title>Confirm Request</Step.Title>
    </Step.Content>
  </Step>
);

const ReviewStepContent = ({ step }) =>
  step === STEPS.review ? (
    <Header>Review before finalize the document request</Header>
  ) : null;

export default class DocumentRequestSteps extends Component {
  calculateStep = (docPid = null, providerPid = null) => {
    const hasDocument = docPid ? true : false;
    // TODO: when we integrated ill_pid or acq_pid
    const hasProvider = providerPid ? true : false;

    let step = STEPS.document;
    if (hasDocument && !hasProvider) step = STEPS.provider;
    if (hasDocument && hasProvider) step = STEPS.review;
    return step;
  };

  renderStepContent(step) {
    switch (step) {
      case STEPS.provider:
        return;
      case STEPS.review:
        return;
      default:
        return (
          <Message warning>
            <Message.Header>Inconsistent state :/ !</Message.Header>
            <p>Try refreshing the page, or contact CDS team.</p>
          </Message>
        );
    }
  }

  render() {
    const { document_pid: docPid, state } = this.props.data.metadata;
    const { data } = this.props;
    const step = this.calculateStep(docPid);
    return state !== 'REJECTED' ? (
      <Container>
        <Step.Group attached="top" fluid>
          <DocumentStep step={step} />
          <ProviderStep step={step} />
          <ReviewStep step={step} />
        </Step.Group>

        <DocumentStepContent
          step={step}
          data={data}
          fetchDocumentRequestDetails={this.props.fetchDocumentRequestDetails}
        />
        <ProviderStepContent step={step} />
        <ReviewStepContent step={step} />
      </Container>
    ) : (
      <Message info>
        <Message.Header>Rejected request!</Message.Header>
        <p>You cannot modify a rejected document request.</p>
      </Message>
    );
  }
}

DocumentRequestSteps.propTypes = {
  data: PropTypes.object.isRequired,
  fetchDocumentRequestDetails: PropTypes.func.isRequired,
};
