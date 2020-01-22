import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Message } from 'semantic-ui-react';
import { AcquisitionRoutes, BackOfficeRoutes, ILLRoutes } from '@routes/urls';
import { documentRequest as documentRequestApi } from '@api';
import _get from 'lodash/get';
import { DocumentIcon } from '@pages/backoffice/components';
import { STEPS } from '../../DocumentRequestSteps';
import { invenioConfig } from '@config';

const PROVIDERS = invenioConfig.documentRequests.physicalItemProviders;

export default class StepsActions extends Component {
  render() {
    const { data, step, fetchDocumentRequestDetails } = this.props;
    return (
      <>
        <DocumentSelection
          data={data}
          fetchDocumentRequestDetails={fetchDocumentRequestDetails}
        />
        {step !== STEPS.document ? (
          <ProviderSelection
            data={data}
            fetchDocumentRequestDetails={fetchDocumentRequestDetails}
          />
        ) : null}
      </>
    );
  }
}

const ProviderLink = ({ provider }) => {
  if (provider.pid_type === PROVIDERS.acq.pid_type) {
    return (
      <Link to={AcquisitionRoutes.orderDetailsFor(provider.pid)}>
        {provider.pid}
      </Link>
    );
  }
  if (provider.pid_type === PROVIDERS.ill.pid_type) {
    return (
      <Link to={ILLRoutes.borrowingRequestDetailsFor(provider.pid)}>
        {provider.pid}
      </Link>
    );
  }
  return null;
};

const ProviderHeader = ({ provider }) => {
  let header = '';
  if (provider.pid_type === PROVIDERS.acq.pid_type)
    header = 'Acquisition Order';
  if (provider.pid_type === PROVIDERS.ill.pid_type)
    header = 'ILL Borrow Request';

  return (
    <Header>
      {header} <ProviderLink provider={provider} />
    </Header>
  );
};

class ProviderSelection extends Component {
  onChangeProvider = async () => {
    const { pid } = this.props.data;
    const resp = await documentRequestApi.pending(pid, {
      remove_fields: ['physical_item_provider'],
    });
    if (resp.status === 202) {
      this.props.fetchDocumentRequestDetails(pid);
    }
  };

  render() {
    const { state } = this.props.data.metadata;
    const provider = _get(this.props, 'data.metadata.physical_item_provider');
    return provider ? (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={12}>
            <ProviderHeader provider={provider} />
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              fluid
              disabled={state !== 'PENDING'}
              name="change-provider"
              onClick={this.onChangeProvider}
              content={`Change provider`}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      <Message warning>
        <Message.Header>
          <DocumentIcon />A provider is required!
        </Message.Header>
        <p>
          You can search and attach one of the existing Acquisition Orders or
          Interlibrary borrow requests, or create a new one.
        </p>
      </Message>
    );
  }
}

class DocumentSelection extends Component {
  onChangeDocument = async () => {
    const { pid } = this.props.data;
    const resp = await documentRequestApi.pending(pid, {
      remove_fields: ['document_pid'],
    });
    if (resp.status === 202) {
      this.props.fetchDocumentRequestDetails(pid);
    }
  };

  render() {
    const { document_pid: docPid, state } = this.props.data.metadata;
    const title = _get(this.props, 'data.metadata.document.title');
    return docPid ? (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={12}>
            <Header>
              Document{' '}
              <Link to={BackOfficeRoutes.documentDetailsFor(docPid)}>
                {title}
              </Link>
            </Header>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              fluid
              disabled={state !== 'PENDING'}
              name="change-document"
              onClick={this.onChangeDocument}
              content={'Change document'}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      <Message warning>
        <Message.Header>
          <DocumentIcon />A document is required!
        </Message.Header>
        <p>
          You can search and attach one of the existing documents, or create a
          new one.
        </p>
      </Message>
    );
  }
}
