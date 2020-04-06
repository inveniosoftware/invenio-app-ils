import React, { Component } from 'react';
import {
  Button,
  Divider,
  Grid,
  Icon,
  Label,
  Segment,
  Step,
} from 'semantic-ui-react';
import { AcquisitionRoutes, ILLRoutes } from '@routes/urls';
import {
  documentRequest as documentRequestApi,
  acqOrder as acqOrderApi,
  illBorrowingRequest as illBrwReqApi,
} from '@api';
import { ESSelector } from '@components/ESSelector';
import {
  serializeAcqOrder,
  serializeBorrowingRequest,
} from '@components/ESSelector/serializer';
import { goTo } from '@history';
import { invenioConfig } from '@config';
import { STEPS } from '../../DocumentRequestSteps';

export const ProviderStep = ({ step }) => (
  <Step active={step === STEPS.provider} disabled={step === STEPS.document}>
    <Icon name="truck" />
    <Step.Content>
      <Step.Title>Select Provider</Step.Title>
      <Step.Description>
        Purchase or borrow from another Library
      </Step.Description>
    </Step.Content>
  </Step>
);

export default class ProviderStepContent extends Component {
  render() {
    const { step, data, fetchDocumentRequestDetails } = this.props;
    return step === STEPS.provider ? (
      <>
        <AcqProvider
          data={data}
          fetchDocumentRequestDetails={fetchDocumentRequestDetails}
        ></AcqProvider>
        <IllProvider></IllProvider>
      </>
    ) : null;
  }
}

class AcqProvider extends Component {
  onCreateClick() {
    return goTo(AcquisitionRoutes.orderCreate);
  }

  onSelectResult = async orderData => {
    const { pid } = this.props.data;
    const { acq } = invenioConfig.documentRequests.physicalItemProviders;
    const resp = await documentRequestApi.addProvider(pid, {
      physical_item_provider: {
        pid: orderData.pid,
        pid_type: acq.pid_type,
      },
    });
    if (resp.status === 202) {
      this.props.fetchDocumentRequestDetails(pid);
    }
  };

  render() {
    const { data } = this.props;
    return (
      <Segment raised>
        <Label color="brown" ribbon>
          Acquisition
        </Label>
        <span>Search and select an existing Acquisition order</span>
        <Grid columns={2} padded>
          <Grid.Column>
            <ESSelector
              onSelectResult={this.onSelectResult}
              query={acqOrderApi.list}
              serializer={serializeAcqOrder}
            />
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Button
              positive
              name="create-acq"
              onClick={() => goTo(AcquisitionRoutes.orderCreate, data)}
              icon={'plus'}
              content={'Create new Acquisition Order'}
            />
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    );
  }
}

class IllProvider extends Component {
  onCreateClick() {
    return goTo(ILLRoutes.borrowingRequestCreate);
  }

  onSelectResult = async data => {
    // NOTE: do the same things as AcqProvider.onSelectResult()
  };

  render() {
    return (
      <Segment raised disabled>
        <Label color="purple" ribbon>
          Interlibrary
        </Label>
        <span>Search and select an existing Inter Library loan</span>
        <Grid columns={2} padded>
          <Grid.Column>
            <ESSelector
              disabled
              onSelectResult={this.onSelectResult}
              query={illBrwReqApi.list}
              serializer={serializeBorrowingRequest}
            />
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Button
              positive
              disabled
              name="create-ill"
              onClick={this.onCreateClick}
              icon={'plus'}
              content={'Create new Interlibrary Loan'}
            />
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    );
  }
}
