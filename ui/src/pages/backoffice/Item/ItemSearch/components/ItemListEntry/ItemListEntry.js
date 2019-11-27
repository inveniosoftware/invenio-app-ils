import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, List } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import { DocumentAuthors } from '@components/Document';
import { isEmpty } from 'lodash';
import {getCover} from "../../../../../frontsite/config";

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
          </Link> <br/>
          by{' '}
          <Link to={BackOfficeRoutes.patronDetailsFor(circulation.patron_pid)}>
            {circulation.patron.name}
          </Link><br/>
          <strong>
            {circulation.start_date} - {circulation.end_date}
          </strong>
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
        <div className={'item-image-addons-wrapper'}>
          <Item.Image
            as={Link}
            to={BackOfficeRoutes.itemDetailsFor(item.metadata.pid)}
            size={'mini'}
            src={getCover(item.metadata.document_pid)}
            onError={e => (e.target.style.display = 'none')}
          />
          <Header disabled as="h6" className={'document-type'}>
            {item.metadata.document.document_type}
          </Header>
        </div>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.itemDetailsFor(item.metadata.pid)}
          >
            {item.metadata.document.title}
          </Item.Header>

          <Grid columns={2}>
            <Grid.Column width={5}>
              <Item.Meta className={'metadata-fields'}>
                <DocumentAuthors
                  metadata={item.metadata.document}
                  prefix={'by '}
                />
                <List>
                  <List.Item>
                    <List.Content>
                      <Icon name={'barcode'} />{' '}
                      <strong>{item.metadata.barcode}</strong>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <Icon name={'map signs'} />
                      {item.metadata.internal_location.location.name} -{' '}
                      {item.metadata.internal_location.name} (
                      <strong>{item.metadata.shelf}</strong>)
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column width={4}>
              <Item.Meta className={'metadata-fields'}>
                <List>
                  <List.Item>
                    <List.Content floated="right">
                      {item.metadata.medium}
                    </List.Content>
                    <List.Content>medium</List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content floated="right">
                      {item.metadata.status}
                    </List.Content>
                    <List.Content>status</List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content floated="right">
                      {item.metadata.circulation_restriction}
                    </List.Content>
                    <List.Content>restrictions</List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column width={5}>
              <ItemCirculation circulation={item.metadata.circulation} />
            </Grid.Column>
            <Grid.Column width={2} textAlign="right">
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
