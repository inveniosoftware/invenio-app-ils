import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class ItemDetailsLink extends Component {
  render() {
    const { itemPid, ...props } = this.props;
    return (
      <Link
        to={BackOfficeRoutes.itemDetailsFor(itemPid)}
        data-test={this.props.itemPid}
        {...props}
      >
        {this.props.children}
      </Link>
    );
  }
}

ItemDetailsLink.propTypes = {
  itemPid: PropTypes.string.isRequired,
};
