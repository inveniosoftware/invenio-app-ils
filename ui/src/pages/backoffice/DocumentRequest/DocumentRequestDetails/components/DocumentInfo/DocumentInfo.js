import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import { documentRequest as documentRequestApi } from '@api';
import _get from 'lodash/get';
import { DocumentIcon } from '@pages/backoffice/components';

export default class DocumentInfo extends Component {
  onChangeDocument = async () => {
    const { pid } = this.props.data;
    const resp = await documentRequestApi.pending(pid);
    if (resp.status === 202) {
      this.props.fetchDocumentRequestDetails(pid);
    }
  };

  render() {
    const { document_pid: docPid, state } = this.props.data.metadata;
    const title = _get(this.props, 'data.metadata.document.title');
    return docPid ? (
      <Segment basic>
        <Grid columns={2}>
          <Grid.Column width={12}>
            <Header>
              Attached Document{' '}
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
        </Grid>
      </Segment>
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
