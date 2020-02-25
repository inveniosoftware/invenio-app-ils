import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Item, Label } from 'semantic-ui-react';
import { toShortDate } from '@api/date';
import { invenioConfig } from '@config';
import { FrontSiteRoutes } from '@routes/urls';
import { DocumentAuthors, DocumentItemCover } from '@components/Document';

export class LoanListEntry extends Component {
  render() {
    const { loan } = this.props;
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
              <Item.Description>
                {}
                You have extended this loan {
                  loan.metadata.extension_count
                } of {invenioConfig.loans.maxExtensionsCount} times
              </Item.Description>
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              mobile={16}
              tablet={8}
              computer={8}
            >
              <Item.Description>
                Please return the literature before date{' '}
                <Label className={'bkg-primary'}>
                  {toShortDate(loan.metadata.end_date)}
                </Label>
                <br />
                {isLoanOverdue
                  ? 'Your loan is overdue. Please return the book ' +
                    'as soon as possible'
                  : null}
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}
