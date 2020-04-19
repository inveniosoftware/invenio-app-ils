import { toShortDate } from '@api/date';
import { CreatedBy, UpdatedBy } from '@components';
import { DocumentTitle } from '@components/Document';
import { MetadataTable } from '@pages/backoffice/components';
import {
  DocumentIcon,
  ILLLibraryIcon,
  PatronIcon,
} from '@pages/backoffice/components/icons';
import { BackOfficeRoutes, ILLRoutes } from '@routes/urls';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { BorrowingRequestPatronLoan } from './components';

class Loan extends React.Component {
  dateOrDefault = value => {
    return value ? toShortDate(value) : '-';
  };

  render() {
    const { brwReq } = this.props;
    const table = [
      {
        name: 'Library',
        value: (
          <Link to={ILLRoutes.libraryDetailsFor(brwReq.library_pid)}>
            <ILLLibraryIcon /> {brwReq.library.name}
          </Link>
        ),
      },
      {
        name: 'Item type',
        value: brwReq.type,
      },
      { name: 'Requested on', value: this.dateOrDefault(brwReq.request_date) },
      {
        name: 'Expected delivery',
        value: this.dateOrDefault(brwReq.expected_delivery_date),
      },
      {
        name: 'Received on',
        value: this.dateOrDefault(brwReq.received_date),
      },
    ];
    return (
      <Grid columns={2} relaxed>
        <Grid.Row>
          <Grid.Column>
            <Divider horizontal>InterLibrary Loan</Divider>
            <MetadataTable labelWidth={5} rows={table} />
          </Grid.Column>
          <Grid.Column>
            <Divider horizontal>Patron Loan</Divider>
            <BorrowingRequestPatronLoan brwReq={brwReq} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class Metadata extends React.Component {
  render() {
    const { brwReq } = this.props;
    const leftTable = [
      {
        name: 'Document',
        value: (
          <Link to={BackOfficeRoutes.documentDetailsFor(brwReq.document_pid)}>
            <DocumentIcon />{' '}
            <DocumentTitle metadata={brwReq.document} truncate={true} />
          </Link>
        ),
      },
      {
        name: 'Patron',
        value: (
          <Link to={BackOfficeRoutes.patronDetailsFor(brwReq.patron_pid)}>
            <PatronIcon /> {brwReq.patron.name}
          </Link>
        ),
      },
    ];
    const rightTable = [
      { name: 'Created by', value: <CreatedBy metadata={brwReq} /> },
      { name: 'Updated by', value: <UpdatedBy metadata={brwReq} /> },
      { name: 'Notes', value: brwReq.notes },
    ];
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export class BorrowingRequestMetadata extends React.Component {
  render() {
    const brwReq = this.props.brwReq;

    return (
      <>
        <Header as="h3" attached="top">
          Request information
        </Header>
        <Segment attached className="bo-metadata-segment" id="request-info">
          <Metadata brwReq={brwReq} />
          <Loan brwReq={brwReq} />
        </Segment>
      </>
    );
  }
}

BorrowingRequestMetadata.propTypes = {
  brwReq: PropTypes.object.isRequired,
};
