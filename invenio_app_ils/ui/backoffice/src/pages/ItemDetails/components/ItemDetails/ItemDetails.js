import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { ItemMetadata } from '../ItemMetadata/ItemMetadata';
import { ItemLoans } from '../ItemLoans/ItemLoans';

import { withError, withLoader } from 'common/hoc';

export const EnchancedItemMetadata = compose(
  withLoader,
  withError
)(ItemMetadata);

export class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchItemDetails = this.props.fetchItemDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.itemId) {
        this.fetchItemDetails(location.state.itemId);
      }
    });
    this.fetchItemDetails(this.props.match.params.itemId);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <section>
        <EnchancedItemMetadata {...this.props} />
        <ItemLoans />
      </section>
    );
  }
}

ItemDetails.propTypes = {
  data: PropTypes.object.isRequired,
};
