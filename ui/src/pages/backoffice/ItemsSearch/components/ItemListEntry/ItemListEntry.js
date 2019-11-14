import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Item, List } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';

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
            {item.metadata.document.title}
          </Item.Header>

          <Item.Meta>
            by {item.metadata.document.authors.map(author => author.full_name)}
          </Item.Meta>

          <Item.Extra>
            <Grid columns={2}>
              <Grid.Column width={6} style={{ padding: 0 }}>
                <List>
                  <List.Item>
                    <List.Content>
                      barcode <strong>{item.metadata.barcode}</strong>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      shelf <strong>{item.metadata.shelf}</strong>
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={5} floated="right" style={{ padding: 0 }}>
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
              </Grid.Column>
            </Grid>
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}
