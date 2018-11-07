import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { ItemMetadata } from '../ItemMetadata/ItemMetadata';
import { ItemLoans } from '../ItemLoans/ItemLoans';

import { withError, withLoader } from 'common/hoc';

export const EnchancedItemMetadata = compose(
  withLoader,
  withError
)(ItemMetadata);

export class ItemDetails extends Component {
  render() {
    let { isLoading, data, error } = this.props;
    return (
      <Container fluid>
        <EnchancedItemMetadata
          data={data}
          isLoading={isLoading}
          error={error}
        />
        <ItemLoans />
      </Container>
    );
  }
}

ItemDetails.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
