import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { ItemTable } from '../ItemTable/ItemTable';
import { withLoader, withError } from 'common/hoc';

const EnchancedTable = compose(
  withError,
  withLoader,
  withRouter
)(ItemTable);

export class ItemList extends Component {
  render() {
    let { isLoading, data } = this.props;
    return (
      <Container>
        <h1>Items</h1>
        <EnchancedTable isLoading={isLoading} data={data} />
      </Container>
    );
  }
}

ItemList.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
