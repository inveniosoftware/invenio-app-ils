import React, { Component } from 'react';
import ShowMore from 'react-show-more';
import { Grid, Segment, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MetadataTable } from '@pages/backoffice/components/MetadataTable';
import { EditButton, NewButton } from '@pages/backoffice/components/buttons';
import { borrowingRequest as borrowingRequestApi } from '@api';
import { ILLRoutes } from '@routes/urls';
import { DeleteRecordModal } from '@pages/backoffice/components/DeleteRecordModal';

export default class LibraryMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteLibrary = props.deleteLibrary;
    this.libraryPid = props.libraryDetails.metadata.pid;
  }

  handleOnRequestRefClick(borrowingRequestPid) {
    const navUrl = ILLRoutes.borrowingRequestDetailsFor(borrowingRequestPid);
    window.open(navUrl, `_borrowing_request_${borrowingRequestPid}`);
  }

  createRefProps = libraryPid => {
    const requestRefProps = {
      refType: 'BorrowingRequest',
      onRefClick: this.handleOnRequestRefClick,
      getRefData: () => borrowingRequestApi.list(libraryPid),
    };

    return [requestRefProps];
  };

  renderHeader(library) {
    return (
      <Grid.Row>
        <Grid.Column width={9} verticalAlign={'middle'}>
          <Header as="h1">
            Library #{library.metadata.pid} - {library.metadata.name}
          </Header>
        </Grid.Column>
        <Grid.Column width={7} textAlign="right">
          <NewButton
            text="New library"
            to={{
              pathname: ILLRoutes.libraryCreate,
            }}
          />
          <EditButton to={ILLRoutes.libraryEditFor(library.metadata.pid)} />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Library
            record with ID ${library.metadata.pid}?`}
            refProps={this.createRefProps(library.metadata.pid)}
            onDelete={() => this.deleteLibrary(library.metadata.pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  prepareData(library) {
    const rows = [
      { name: 'Library', value: library.metadata.name },
      {
        name: 'Library id',
        value: library.metadata.pid,
      },
      {
        name: 'Name',
        value: library.metadata.name,
      },
      {
        name: 'Notes',
        value: (
          <ShowMore
            lines={3}
            more="Show more"
            less="Show less"
            anchorClass="button-show-more"
          >
            {library.metadata.notes}
          </ShowMore>
        ),
      },
    ];
    return rows;
  }

  render() {
    const { libraryDetails } = this.props;
    const rows = this.prepareData(libraryDetails);
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(libraryDetails)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

LibraryMetadata.propTypes = {
  libraryDetails: PropTypes.object.isRequired,
};
