import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class DocumentDetailsLink extends Component {
  render() {
    return (
      <Link
        to={BackOfficeRoutes.documentDetailsFor(this.props.documentPid)}
        data-test={this.props.documentPid}
        {...this.props}
      >
        {this.props.children}
      </Link>
    );
  }
}

DocumentDetailsLink.propTypes = {
  documentPid: PropTypes.string.isRequired,
};
