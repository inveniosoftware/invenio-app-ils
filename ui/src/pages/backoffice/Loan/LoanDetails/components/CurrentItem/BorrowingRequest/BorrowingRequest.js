import {
  BorrowingRequestDetailsLink,
  InfoMessage,
} from '@pages/backoffice/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BorrowingRequest extends Component {
  render() {
    const { item } = this.props;
    return (
      <InfoMessage header={'ILL Copy'}>
        The physical copy of this loan is from an external library. Check{' '}
        <BorrowingRequestDetailsLink brwPid={item.pid}>
          {' '}
          this borrowing request{' '}
        </BorrowingRequestDetailsLink>{' '}
        for more details
      </InfoMessage>
    );
  }
}

BorrowingRequest.propTypes = {
  item: PropTypes.object.isRequired,
};
