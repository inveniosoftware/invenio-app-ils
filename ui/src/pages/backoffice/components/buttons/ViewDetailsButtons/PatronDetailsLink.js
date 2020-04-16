import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class PatronDetailsLink extends Component {
  render() {
    const { patronPid, ...props } = this.props;
    return (
      <Link
        to={BackOfficeRoutes.patronDetailsFor(patronPid)}
        data-test={this.props.patronPid}
        {...props}
      >
        {this.props.children}
      </Link>
    );
  }
}

PatronDetailsLink.propTypes = {
  patronPid: PropTypes.string.isRequired,
};
