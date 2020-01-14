import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class DocumentViewDetailsLink extends Component {
  render() {
    return (
      <Link
        to={BackOfficeRoutes.documentDetailsFor(this.props.documentPid)}
        {...this.props}
      >
        {this.props.children}
      </Link>
    );
  }
}

DocumentViewDetailsLink.propTypes = {
  documentPid: PropTypes.string.isRequired,
};
