import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { Error, Loader } from '../../../../../common/components';
import _isEmpty from 'lodash/isEmpty';

export default class ItemsCheckout extends Component {
  constructor(props) {
    super(props);
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
  }

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    const messageInfo = (
      <Message color="blue">
        Scan the barcode to perform a loan for this user.
      </Message>
    );

    const messageSuccess = (
      <Message color="green" data-test="success">
        The new loan was created.
      </Message>
    );

    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          {_isEmpty(data) ? messageInfo : messageSuccess}
        </Error>
      </Loader>
    );
  }
}

ItemsCheckout.propTypes = {
  checkoutItem: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
