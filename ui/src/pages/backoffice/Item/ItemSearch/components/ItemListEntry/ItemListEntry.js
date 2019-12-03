import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, List } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import { DocumentAuthors } from '@components/Document';
import { isEmpty } from 'lodash';

class ItemCirculation extends Component {
  render() {
    const { circulation } = this.props;
    if (isEmpty(circulation)) {
      return null;
    } else {
      return (
        <>
          Currently on{' '}
          <Link to={BackOfficeRoutes.loanDetailsFor(circulation.loan_pid)}>
            loan (#{circulation.loan_pid})
          </Link>{' '}
          <br />
          by{' '}
          <Link to={BackOfficeRoutes.patronDetailsFor(circulation.patron_pid)}>
            {circulation.patron.name}
          </Link>
          <br />
          from <strong> {circulation.start_date} </strong>until{' '}
          <strong>{circulation.end_date}</strong>
        </>
      );
    }
  }
}

export class ItemListEntry extends Component {
  render() {
    const { item } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.itemDetailsFor(item.metadata.pid)}
          >
            <Icon name={'barcode'} /> {item.metadata.barcode}
          </Item.Header>{' '}
          <Header as="h5"> - {item.metadata.document.title}</Header>
          <Grid columns={2}>
            <Grid.Column computer={6} largeScreen={6}>
              <Item.Meta className={'metadata-fields'}>
                <DocumentAuthors
                  metadata={item.metadata.document}
                  prefix={'by '}
                />
                <List>
                  <List.Item>
                    <List.Content>
                      {item.metadata.internal_location.location.name} -{' '}
                      {item.metadata.internal_location.name}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      {' '}
                      shelf <strong>{item.metadata.shelf}</strong>
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              <Item.Meta className={'metadata-fields'}>
                <List>
                  <List.Item>
                    <List.Content>
                      medium{' '}
                      <span className="ml-10">
                        <strong>{item.metadata.medium}</strong>
                      </span>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      status
                      <span className="ml-10">
                        <strong>{item.metadata.status}</strong>
                      </span>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      restrictions
                      <span className="ml-10">
                        <strong>{item.metadata.circulation_restriction}</strong>
                      </span>
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              <ItemCirculation circulation={item.metadata.circulation} />
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={2} textAlign="right">
              <Item.Meta className={'pid-field'}>
                <Header disabled as="h5" className={'pid-field'}>
                  #{item.metadata.pid}
                </Header>
              </Item.Meta>
              <Link
                to={BackOfficeRoutes.documentDetailsFor(
                  item.metadata.document_pid
                )}
              >
                Document #{item.metadata.document_pid}
              </Link>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}
