import { toShortDate } from '@api/date';
import { DocumentAuthors, DocumentItemCover } from '@components/Document';
import { FrontSiteRoutes } from '@routes/urls';
import _get from 'lodash/get';
import _has from 'lodash/has';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Icon, Item, Popup } from 'semantic-ui-react';

export class LoanRequestListEntry extends Component {
  render() {
    const { loan } = this.props;

    return (
      <Item key={loan.metadata.pid} data-test={loan.metadata.pid}>
        <DocumentItemCover
          size="mini"
          isRestricted={_get(loan, 'metadata.document.restricted', false)}
          coverUrl={_get(loan, 'metadata.document.cover_urls.medium')}
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
                <DocumentAuthors metadata={loan.metadata.document} />
                Requested on {toShortDate(loan.metadata.request_start_date)}
                <br />
                Valid until {toShortDate(loan.metadata.request_expire_date)}
                <Popup
                  content={
                    'If the request was not processed ' +
                    'before this date it will be invalidated'
                  }
                  trigger={<Icon name={'info'} />}
                />
              </Item.Meta>
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              mobile={16}
              tablet={8}
              computer={8}
            >
              <Item.Description>
                {_has(loan, 'availableActions.cancel') && (
                  <Button
                    size="small"
                    onClick={e => this.props.onCancelButton(e, loan)}
                  >
                    Cancel
                  </Button>
                )}
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

LoanRequestListEntry.propTypes = {
  loan: PropTypes.object.isRequired,
  onCancelButton: PropTypes.func.isRequired,
};
