import { DocumentAuthors } from '@components/Document';
import { DocumentIcon, ItemIcon, LoanIcon } from '@pages/backoffice/components';
import { BackOfficeRoutes } from '@routes/urls';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Item, Label, List } from 'semantic-ui-react';
import { LoanLinkToItem } from '../../components/Loan';
import { OverdueLoanSendMailModal } from '../../components/OverdueLoanSendMailModal';
import { LoanDates } from './LoanDates';

export class LoanListEntry extends Component {
  render() {
    const { loan } = this.props;

    return (
      <Item>
        <Item.Content>
          {loan.metadata.is_overdue && (
            <Label color="red" ribbon>
              Overdue
            </Label>
          )}
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.loanDetailsFor(loan.metadata.pid)}
            data-test={`navigate-${loan.metadata.pid}`}
          >
            <LoanIcon /> Loan #{loan.metadata.pid}
          </Item.Header>
          <Grid columns={5}>
            <Grid.Column computer={6} largeScreen={5}>
              <label>Patron</label>{' '}
              <Link
                to={BackOfficeRoutes.patronDetailsFor(loan.metadata.patron_pid)}
              >
                {loan.metadata.patron.name}
              </Link>{' '}
              requested:
              <Item.Meta className={'document-authors'}>
                <Header className="loan-document-title" as="h5">
                  {loan.metadata.document.title}
                </Header>
                <DocumentAuthors
                  metadata={loan.metadata.document}
                  prefix={'by '}
                  authorsLimit={10}
                />
              </Item.Meta>
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={3}>
              <List>
                <List.Item>
                  <List.Content floated="right">
                    {loan.metadata.state}
                  </List.Content>
                  <List.Content>
                    <label>State</label>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <LoanDates loan={loan} />
                </List.Item>
                <List.Item>
                  <List.Content floated="right">
                    {loan.metadata.extension_count || '0'}
                  </List.Content>
                  <List.Content>
                    <label> Extensions</label>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={2}>
              <OverdueLoanSendMailModal loan={loan} />
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={3}>
              {!_isEmpty(loan.metadata.item_pid) && (
                <List>
                  <List.Item>
                    <List.Content>
                      Item{' '}
                      <LoanLinkToItem itemPid={loan.metadata.item_pid}>
                        {loan.metadata.item.barcode && (
                          <>
                            <ItemIcon />
                            {loan.metadata.item.barcode}
                          </>
                        )}
                      </LoanLinkToItem>
                    </List.Content>
                    {loan.metadata.item.medium && (
                      <List.Content>
                        <label>medium</label> {loan.metadata.item.medium}
                      </List.Content>
                    )}
                  </List.Item>
                </List>
              )}
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={2} textAlign="right">
              <Link
                to={BackOfficeRoutes.documentDetailsFor(
                  loan.metadata.document_pid
                )}
              >
                Document <DocumentIcon />
              </Link>
              <br />
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className={'pid-field'}>#{loan.metadata.pid}</div>
      </Item>
    );
  }
}

LoanListEntry.propTypes = {
  loan: PropTypes.object.isRequired,
};
