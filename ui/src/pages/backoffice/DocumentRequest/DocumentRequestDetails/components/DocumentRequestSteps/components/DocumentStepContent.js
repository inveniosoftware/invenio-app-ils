import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Icon,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react';
import { ESSelector } from '@components/ESSelector';
import { serializeDocument } from '@components/ESSelector/serializer';
import {
  document as documentApi,
  documentRequest as documentRequestApi,
} from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { goTo } from '@history';
import _isEmpty from 'lodash/isEmpty';
import { STEPS } from '../DocumentRequestSteps';

export class DocumentStepContent extends Component {
  onSelectResult = async data => {
    const { pid } = this.props.data;
    const resp = await documentRequestApi.accept(pid, {
      document_pid: data.key,
    });
    if (resp.status === 202) {
      this.props.fetchDocumentRequestDetails(pid);
    }
  };

  createDocumentButton = () => {
    const { data } = this.props;
    return (
      <Button
        name="create-doc-from-doc-request"
        labelPosition="left"
        positive
        icon
        onClick={() => goTo(BackOfficeRoutes.documentCreate, data)}
        disabled={
          _isEmpty(data.metadata.document) && data.metadata.state === 'PENDING'
            ? false
            : true
        }
      >
        <Icon name="plus" />
        Create new document
      </Button>
    );
  };

  render() {
    const { step } = this.props;
    return step === STEPS.document ? (
      <Segment>
        <Grid columns={2}>
          <Grid.Column>
            <Header as="h3">Search and select document</Header>
            <ESSelector
              onSelectResult={this.onSelectResult}
              query={documentApi.list}
              serializer={serializeDocument}
            />
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            {this.createDocumentButton()}
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    ) : null;
  }
}

DocumentStepContent.propTypes = {
  data: PropTypes.object.isRequired,
};
