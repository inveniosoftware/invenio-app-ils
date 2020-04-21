import { toShortDate } from '@api/date';
import { DocumentItemCover } from '@components/Document';
import { FrontSiteRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Message, Grid, Item } from 'semantic-ui-react';

export class BorrowingRequestListEntry extends Component {
  render() {
    const { loan } = this.props;

    return (
      <Item key={loan.metadata.pid} data-test={loan.metadata.pid}>
        <DocumentItemCover
          size="mini"
          metadata={loan.metadata.document}
          disabled
          linkTo={FrontSiteRoutes.documentDetailsFor(
            loan.metadata.document_pid
          )}
        />

        <Item.Content>
          <Item.Header
            as={Link}
            to={FrontSiteRoutes.documentDetailsFor(loan.metadata.document_pid)}
          >
            {loan.metadata.document.title}
          </Item.Header>
          <Grid columns={2}>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Item.Meta>
                Created on {toShortDate(loan.created)}
                <br />
                {loan.metadata.status}
              </Item.Meta>
            </Grid.Column>
            <Grid.Column textAlign="right" mobile={16} tablet={8} computer={8}>
              <Item.Description>
                <Message compact size="small">
                  To <b>cancel</b> this request, please contact the library.
                </Message>
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

BorrowingRequestListEntry.propTypes = {
  loan: PropTypes.object.isRequired,
  onCancelButton: PropTypes.func.isRequired,
};
