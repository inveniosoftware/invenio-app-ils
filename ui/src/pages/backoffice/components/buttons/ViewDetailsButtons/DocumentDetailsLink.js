import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class DocumentDetailsLink extends Component {
  render() {
    const {documentPid, ...props} = this.props;
    return (
      <Link
        to={BackOfficeRoutes.documentDetailsFor(documentPid)}
        data-test={this.props.documentPid}
        {...props}
      >
        {this.props.children}
      </Link>
    );
  }
}

DocumentDetailsLink.propTypes = {
  documentPid: PropTypes.string.isRequired,
};
