import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Item, Label } from 'semantic-ui-react';
import { toShortDate } from '@api/date';
import { FrontSiteRoutes } from '@routes/urls';
import { DocumentAuthors, DocumentItemCover } from '@components/Document';
import { ExtendButton } from '../';

const OverdueLabel = () => {
  return (
    <h4>Your loan is overdue. Please return the book as soon as possible!</h4>
  );
};

const ReturnLabel = ({ endDate }) => {
  return (
    <h4>
      Please return the literature before date{' '}
      <Label className={'bkg-primary'}>{toShortDate(endDate)}</Label>
    </h4>
  );
};

const ExtensionCount = ({ count }) =>
  count > 0 && (
    <Item.Description>
      You have extended this loan {count} times
    </Item.Description>
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
          src={loan.metadata.document.edition}
          document={loan.metadata.document}
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
                  <ReturnLabel endDate={loan.metadata.end_date}></ReturnLabel>
                )}
                <br />
                <ExtendButton
                  loan={loan}
                  extendLoan={extendLoan}
                  onExtendSuccess={onExtendSuccess}
                ></ExtendButton>
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
