import React, { Component } from 'react';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { ItemTable } from '../ItemTable/ItemTable';
import { withLoader, withError } from 'common/hoc';

const EnchancedTable = compose(
  withError,
  withLoader
)(ItemTable);

export class ItemList extends Component {
  render() {
    return (
      <Container>
        <h1>Items</h1>
        <EnchancedTable {...this.props} />
      </Container>
    );
  }
}
