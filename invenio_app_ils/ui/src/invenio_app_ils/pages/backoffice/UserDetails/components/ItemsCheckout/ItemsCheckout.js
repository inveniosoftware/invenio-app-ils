import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { Error, Loader } from '../../../../../common/components';

export default class ItemsCheckout extends Component {
  constructor(props) {
    super(props);
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
  }

  render() {
    const { isLoading, error } = this.props;

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Message color="blue">
            Scan the barcode to perform a loan for this user.
          </Message>
        </Error>
      </Loader>
    );
  }
}

ItemsCheckout.propTypes = {
  checkoutItem: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  error: PropTypes.object,
};
