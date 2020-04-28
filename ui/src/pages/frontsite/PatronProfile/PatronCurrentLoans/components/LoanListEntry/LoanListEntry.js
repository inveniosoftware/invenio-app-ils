import { toShortDate } from '@api/date';
import { DocumentAuthors, DocumentItemCover } from '@components/Document';
import { ExtensionCount } from '@pages/frontsite/components/Loan';
import { FrontSiteRoutes } from '@routes/urls';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Item, Popup, Icon, Header } from 'semantic-ui-react';
import { ExtendButton } from '../';

const OverdueLabel = () => (
  <h4>
    Your loan is overdue. Please return the literature as soon as possible!
  </h4>
);

const ReturnLabel = ({ endDate }) => (
  <h4>
    Please return the literature before date{' '}
    <Header size="large">{toShortDate(endDate)}</Header>
  </h4>
);

export class LoanListEntry extends Component {
  render() {
    const { loan, extendLoan, onExtendSuccess } = this.props;
    const isLoanOverdue = loan.metadata.is_overdue;
    return (
      <Item
        className={isLoanOverdue ? 'bkg-danger' : ''}
        key={loan.metadata.pid}
      >
        <DocumentItemCover
          size="mini"
          isRestricted={_get(loan, 'metadata.document.restricted', false)}
          coverUrl={_get(loan, 'metadata.document.cover_metadata.urls.medium')}
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
            {loan.metadata.document.title}{' '}
            {loan.metadata.item_pid.type === 'illbid' && (
              <Popup
                content={
                  'This loan involves 3rd party library, please return on time'
                }
                trigger={
                  <Icon name={'exclamation circle'} size="large" color="red" />
                }
              />
            )}
          </Item.Header>

          <Grid columns={2}>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Item.Meta>
                <DocumentAuthors metadata={loan.metadata.document} />
                Loaned on {toShortDate(loan.metadata.start_date)}
              </Item.Meta>
              <ExtensionCount count={loan.metadata.extension_count} />
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              mobile={16}
              tablet={8}
              computer={8}
            >
              <Item.Description>
                {isLoanOverdue ? (
                  <OverdueLabel />
                ) : (
                  <ReturnLabel endDate={loan.metadata.end_date} />
                )}
                <br />
                {loan.metadata.item_pid.type !== 'illbid' && (
                  <ExtendButton
                    loan={loan}
                    extendLoan={extendLoan}
                    onExtendSuccess={onExtendSuccess}
                  />
                )}
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

LoanListEntry.propTypes = {
  loan: PropTypes.object.isRequired,
  extendLoan: PropTypes.func,
  onExtendSuccess: PropTypes.func,
};
