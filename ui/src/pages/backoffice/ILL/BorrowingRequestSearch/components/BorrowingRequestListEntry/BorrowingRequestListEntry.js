import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Item } from 'semantic-ui-react';
import { ILLRoutes } from '@routes/urls';
import Truncate from 'react-truncate';

export class BorrowingRequestListEntry extends Component {
  render() {
    const { borrowingRequest } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={ILLRoutes.borrowingRequestDetailsFor(
              borrowingRequest.metadata.pid
            )}
          >
            Request - {borrowingRequest.metadata.pid}
          </Item.Header>
          <Grid columns={1}>
            <Grid.Column computer={16} largeScreen={16}>
              <Item.Description className={'metadata-fields'}>
                <label>Library </label>
                <Item.Header
                  as={Link}
                  to={ILLRoutes.libraryDetailsFor(
                    borrowingRequest.metadata.library.pid
                  )}
                >
                  {borrowingRequest.metadata.library.name}
                </Item.Header>
              </Item.Description>
              <Item.Description>
                <label>Status </label>
                {borrowingRequest.metadata.status}
              </Item.Description>
              {borrowingRequest.metadata.status === 'CANCELLED' && (
                <Item.Description>
                  <label>Reason </label>
                  {borrowingRequest.metadata.cancel_reason}
                </Item.Description>
              )}
              <Item.Description>
                <label>Notes </label>
                <Truncate lines={3}>{borrowingRequest.metadata.notes}</Truncate>
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}
