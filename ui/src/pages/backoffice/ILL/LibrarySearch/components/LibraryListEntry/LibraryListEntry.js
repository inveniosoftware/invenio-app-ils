import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Item } from 'semantic-ui-react';
import { ILLRoutes } from '@routes/urls';
import Truncate from 'react-truncate';

export class LibraryListEntry extends Component {
  render() {
    const { library } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={ILLRoutes.libraryDetailsFor(library.metadata.pid)}
          >
            <Icon name={'book'} /> {library.metadata.name}
          </Item.Header>
          <Grid columns={1}>
            <Grid.Column computer={16} largeScreen={16}>
              <Item.Meta className={'metadata-fields'}></Item.Meta>
              <Item.Description>
                <Truncate lines={3}>{library.metadata.notes}</Truncate>
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}
