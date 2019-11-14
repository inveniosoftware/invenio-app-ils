import { Grid, Responsive } from 'semantic-ui-react';
import React, { Component } from 'react';
import { SearchPagination } from '../SearchPagination';

export default class SearchFooter extends Component {
  render() {
    return (
      <Responsive>
        <Grid textAlign={'center'} className={'search-footer-pagination'}>
          <Grid.Column>
            <SearchPagination />
          </Grid.Column>
        </Grid>
      </Responsive>
    );
  }
}
