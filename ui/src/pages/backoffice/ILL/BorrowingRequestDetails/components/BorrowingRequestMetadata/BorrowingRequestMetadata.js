import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { MetadataTable } from '@pages/backoffice/components/MetadataTable';
import { ILLRoutes } from '@routes/urls';
import { RequestActions } from '@components/RequestActions';
import { DeleteRecordModal } from '@pages/backoffice/components/DeleteRecordModal';
import { EditButton, NewButton } from '@pages/backoffice/components/buttons';

export default class BorrowingRequestMetadata extends Component {
  addRow(rows, name, value) {
    if (value) {
      rows.push({ name, value });
    }
  }

  prepareData(data) {
    const libraryPid = data.metadata.library_pid;
    const rows = [];
    this.addRow(rows, 'Request Id', data.metadata.pid);
    this.addRow(rows, 'Status', data.metadata.status);
    if (libraryPid) {
      rows.push({
        name: 'Library',
        value: (
          <Link to={ILLRoutes.libraryDetailsFor(data.metadata.library_pid)}>
            {libraryPid}
          </Link>
        ),
      });
    } else {
      rows.push({ name: 'Library', value: 'None' });
    }
    this.addRow(rows, 'Cancel Reason', data.metadata.cancel_reason);
    this.addRow(rows, 'Notes', data.metadata.notes);
    return rows;
  }

  renderHeader(request) {
    return (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">Borrowing Request #{request.metadata.pid}</Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <NewButton
            text="New borrowing request"
            to={{
              pathname: ILLRoutes.borrowingRequestCreate,
            }}
          />
          <EditButton
            to={ILLRoutes.borrowingRequestEditFor(request.metadata.pid)}
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Borrowing Request
            record with ID ${request.metadata.pid}?`}
            refProps={[]}
            onDelete={() => this.props.deleteRequest(request.metadata.pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  render() {
    const request = this.props.borrowingRequestDetails;
    const rows = this.prepareData(request);
    return (
      <Segment className="document-request-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(request)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <RequestActions
          requestPid={request.metadata.pid}
          requestState={request.metadata.status}
          renderRequestCancelHeader={pid =>
            `Reject Borrowing Request #${request.metadata.pid}`
          }
          renderRequestCancelContent={pid => `You are about to reject Borrowing request #${pid}.
                    Please enter a reason for rejecting this request.`}
          rejectRequest={this.props.rejectRequest}
        />
      </Segment>
    );
  }
}

BorrowingRequestMetadata.propTypes = {
  borrowingRequestDetails: PropTypes.object.isRequired,
};
