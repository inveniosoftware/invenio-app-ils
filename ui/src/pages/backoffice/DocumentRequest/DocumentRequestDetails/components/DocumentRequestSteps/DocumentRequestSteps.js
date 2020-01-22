import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Message, Step, Divider } from 'semantic-ui-react';
import {
  DocumentStep,
  DocumentStepContent,
  ProviderStep,
  ProviderStepContent,
  ReviewStep,
  ReviewStepContent,
  StepsActions,
} from './components';
import _get from 'lodash/get';

export const STEPS = {
  document: 'document',
  provider: 'provider',
  review: 'review',
};

export default class DocumentRequestSteps extends Component {
  calculateStep = (docPid = undefined, providerPid = undefined) => {
    const hasDocument = docPid ? true : false;
    const hasProvider = providerPid ? true : false;

    let step = STEPS.document;
    if (hasDocument && !hasProvider) step = STEPS.provider;
    if (hasDocument && hasProvider) step = STEPS.review;
    return step;
  };

  render() {
    const { document_pid: docPid, state } = this.props.data.metadata;
    const providerPid = _get(
      this.props,
      'data.metadata.physical_item_provider.pid'
    );
    const step = this.calculateStep(docPid, providerPid);
    return state !== 'REJECTED' ? (
      <Container>
        <StepsActions step={step} />
        <Divider />
        <Step.Group attached="top" fluid>
          <DocumentStep step={step} />
          <ProviderStep step={step} />
          <ReviewStep step={step} />
        </Step.Group>

        <DocumentStepContent step={step} />
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
