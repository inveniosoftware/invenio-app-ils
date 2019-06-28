import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { ItemMetadata, ItemPastLoans } from '../';

export default class ItemDetails extends Component {
  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ItemMetadata />
          <ItemPastLoans />
        </Error>
      </Loader>
    );
  }
}

ItemDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
};
