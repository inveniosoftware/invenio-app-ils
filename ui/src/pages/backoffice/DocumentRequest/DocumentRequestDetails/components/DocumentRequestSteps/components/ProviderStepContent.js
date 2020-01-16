import React, { Component } from 'react';
import { Button, Divider, Grid, Label, Segment } from 'semantic-ui-react';
import { AcquisitionRoutes, ILLRoutes } from '@routes/urls';
import { order as acqOrderApi } from '@api/acquisition';
import { borrowingRequest as borrowingRequestApi } from '@api/ill';
import { ESSelector } from '@components/ESSelector';
import {
  serializeAcqOrder,
  serializeBorrowingRequest,
} from '@components/ESSelector/serializer';
import { goTo } from '@history';
import { STEPS } from '../DocumentRequestSteps';

class AcqProvider extends Component {
  onCreateClick() {
    return goTo(AcquisitionRoutes.orderCreate);
  }

  onSelectResult = async data => {
    // TODO: Fire a request to update document request with provider info
    // const resp = await documentRequestApi.accept(pid, {
    //   provider: {type: "ILL or ACQ", value: data.pid},
    // });

    // NOTE: Redirect back here to continue with the next step
    // if (resp.status === 202) {
    //   this.props.fetchDocumentRequestDetails(pid);
    // }
    console.log('Selected ACQ data', data);
  };

  render() {
    return (
      <Segment raised>
        <Label ribbon color="brown">
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
              style={{ width: '300px' }}
              name="create-acq"
              onClick={this.onCreateClick}
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
    console.log('Selected ILL data', data);
  };

  render() {
    return (
      <Segment raised>
        <Label color="purple" ribbon>
          Interlibrary
        </Label>
        <span>Search and select an existing Inter Library loan</span>
        <Grid columns={2} padded>
          <Grid.Column>
            <ESSelector
              onSelectResult={this.onSelectResult}
              query={borrowingRequestApi.list}
              serializer={serializeBorrowingRequest}
            />
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Button
              positive
              style={{ width: '300px' }}
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

export class ProviderStepContent extends Component {
  render() {
    const { step } = this.props;
    return step === STEPS.provider ? (
      <>
        <AcqProvider></AcqProvider>
        <IllProvider></IllProvider>
      </>
    ) : null;
  }
}
