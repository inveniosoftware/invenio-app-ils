import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { DetailsRouteByPidTypeFor } from '@routes/urls';

export default class LoanLinkToItem extends Component {
  render() {
    const { itemPid } = this.props;
    return (
      !isEmpty(itemPid) && (
        <Link to={DetailsRouteByPidTypeFor(itemPid.type)(itemPid.value)}>
          {this.props.children}
        </Link>
      )
    );
  }
}

LoanLinkToItem.propTypes = {
  itemPid: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

LoanLinkToItem.defaultProps = {};
