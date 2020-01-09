import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Divider, Grid, Header, Segment, Button } from 'semantic-ui-react';
import { MetadataTable } from '@pages/backoffice/components/MetadataTable';
import { BackOfficeRoutes } from '@routes/urls';
import { DeleteRecordModal } from '@pages/backoffice/components/DeleteRecordModal';
import { DocumentRequestActions } from '../DocumentRequestActions';
import { goTo } from '@history';
import _isEmpty from 'lodash/isEmpty';

export default class DocumentRequestMetadata extends Component {
  addRow(rows, name, value) {
    if (value) {
      rows.push({ name, value });
    }
  }

  prepareLeftData(data) {
    const patronLink = (
      <Link to={BackOfficeRoutes.patronDetailsFor(data.metadata.patron_pid)}>
        {data.metadata.patron.name}
      </Link>
    );
    const rows = [
      { name: 'State', value: data.metadata.state },
      { name: 'Patron', value: patronLink },
      { name: 'Title', value: data.metadata.title },
    ];
    this.addRow(rows, 'Journal Title', data.metadata.journal_title);
    this.addRow(rows, 'Authors', data.metadata.authors);
    this.addRow(rows, 'Edition', data.metadata.edition);
    this.addRow(rows, 'Standard Number', data.metadata.standard_number);
    this.addRow(rows, 'ISBN', data.metadata.isbn);
    this.addRow(rows, 'ISSN', data.metadata.issn);
    this.addRow(rows, 'Volume', data.metadata.volume);
    this.addRow(rows, 'Page', data.metadata.page);
    this.addRow(rows, 'Publication Year', data.metadata.publication_year);
    this.addRow(rows, 'Note', data.metadata.note);
    this.addRow(rows, 'Reject Reason', data.metadata.reject_reason);
    return rows;
  }

  prepareRightData(data) {
    const { document_pid: docPid } = data.metadata;
    const rows = [];
    if (docPid) {
      rows.push({
        name: 'Document',
        value: (
          <Link to={BackOfficeRoutes.documentDetailsFor(docPid)}>
            {data.metadata.document.title}
          </Link>
        ),
      });
    } else {
      rows.push({ name: 'Document', value: 'None' });
    }
    return rows;
  }

  renderHeader(request) {
    return (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">
            Document Request #{request.pid} - {request.metadata.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Document Request
            record with ID ${request.pid}?`}
            refProps={[]}
            onDelete={() => this.props.deleteRequest(request.pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  createDocumentButton = () => {
    const { documentRequestDetails: request } = this.props;
    return (
      <Button
        size="small"
        name="create-doc-from-doc-request"
        onClick={() => goTo(BackOfficeRoutes.documentCreate, request)}
        disabled={
          _isEmpty(request.metadata.document) &&
          request.metadata.state === 'PENDING'
            ? false
            : true
        }
      >
        Create document from request
      </Button>
    );
  };

  render() {
    const request = this.props.documentRequestDetails;
    const leftRows = this.prepareLeftData(request);
    const rightRows = this.prepareRightData(request);
    return (
      <Segment className="document-request-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(request)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={leftRows} />
            </Grid.Column>
            <Grid.Column>
              <MetadataTable rows={rightRows} />
              {this.createDocumentButton()}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider />
        <DocumentRequestActions
          request={request.metadata}
          rejectRequest={this.props.rejectRequest}
        />
      </Segment>
    );
  }
}

DocumentRequestMetadata.propTypes = {
  documentRequestDetails: PropTypes.object.isRequired,
};
