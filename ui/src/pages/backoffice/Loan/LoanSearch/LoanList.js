import { DocumentIcon, ItemIcon, LoanIcon } from '@pages/backoffice';
import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Grid, Header, Icon, Item, Label, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DocumentAuthors } from '@components/Document';
import { SearchEmptyResults } from '@components/SearchControls';
import { BackOfficeRoutes } from '@routes/urls';
import { OverdueLoanSendMailModal } from '../../components/OverdueLoanSendMailModal';
import { invenioConfig } from '@config';
import { LoanLinkToItem } from '../../components/Loan';

class LoanDates extends Component {
  render() {
    const { loan } = this.props;
    if (
      invenioConfig.circulation.loanRequestStates.includes(loan.metadata.state)
    ) {
      return (
        <>
          <List.Content floated="right">
            {loan.metadata.request_start_date}
          </List.Content>
          <List.Content>
            <label> Requested on </label>
          </List.Content>
          <List.Content floated="right">
            {loan.metadata.request_expire_date}
          </List.Content>
          <List.Content>
            <label> Expires on </label>
          </List.Content>
        </>
      );
    } else {
      return (
        <>
          <List.Content floated="right">
            {loan.metadata.start_date}
          </List.Content>
          <List.Content>
            <label> Start date </label>
          </List.Content>
          <List.Content floated="right">
            {loan.metadata.is_overdue && <Icon name="warning" />}
            {loan.metadata.end_date}
          </List.Content>
          <List.Content>
            <label> End date </label>
          </List.Content>
        </>
      );
    }
  }
}

class LoanListEntry extends Component {
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
              {!isEmpty(loan.metadata.item_pid) && (
                <>
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
                </>
              )}
              {loan.metadata.circulation && (
                <List.Content>
                  <label>Physical copies available</label>{' '}
                  {loan.metadata.document.circulation.has_items_for_loan}
                </List.Content>
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

export default class LoanList extends Component {
  renderListEntry = loan => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(loan);
    }
    return <LoanListEntry key={loan.metadata.pid} loan={loan} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length) return <SearchEmptyResults />;

    return (
      <Item.Group divided className={'bo-loan-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}
